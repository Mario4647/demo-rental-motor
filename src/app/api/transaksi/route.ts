import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { rateLimitAsync, TRANSACTION_LIMIT } from '@/lib/security/rateLimiter';
import { validateCSRF } from '@/lib/security/csrf';
import { getAuthUser } from '@/lib/security/rbac';
import { encrypt } from '@/lib/security/encryption';
import { createTransaksiSchema } from '@/lib/validations/data';
import { createSnapToken } from '@/lib/midtrans';

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin.from('transaksi').select('*, produk(*), unit(*)').order('created_at', { ascending: false });

    if (auth.profile.role === 'user') {
      query = query.eq('user_id', auth.user.id);
    } else if (auth.profile.role === 'karyawan') {
      // Assuming 'active' means not selesai/dibatalkan
      query = query.not('status', 'in', '("selesai","dibatalkan")');
    }
    // admin gets all

    const { data: transaksi, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: transaksi }, { status: 200 });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { allowed, retryAfter } = await rateLimitAsync(req, TRANSACTION_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    if (!validateCSRF(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createTransaksiSchema.safeParse(body);
    
    if (!validatedData.success) {
      console.error('Validation error in /api/transaksi:', JSON.stringify(validatedData.error.format(), null, 2));
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const data = validatedData.data;
    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();

    // Recalculate price from DB
    const { data: produk, error: produkError } = await supabaseAdmin.from('produk')
      .select('harga_per_hari')
      .eq('id', data.produk_id)
      .single();

    if (produkError || !produk) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const start = new Date(data.tanggal_mulai);
    const days = data.durasi_hari;
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const tanggal_selesai_sewa = end.toISOString().split('T')[0];

    const calculatedPrice = days * produk.harga_per_hari;

    // Generate invoice id
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const invoiceId = `INV-${todayStr}-${randomDigits}`;

    const encryptedNik = data.nik_penyewa ? encrypt(data.nik_penyewa) : auth.profile.nik;
    const encryptedHp = data.no_hp_penyewa ? encrypt(data.no_hp_penyewa) : auth.profile.no_hp;

    let status = 'pending';
    let snapToken = null;
    let midtransOrderId = null;
    let paymentDeadline = null;

    if (data.metode_pembayaran === 'cash') {
      status = 'dibayar'; // As requested
    } else if (data.metode_pembayaran === 'midtrans') {
      status = 'menunggu_pembayaran';
      midtransOrderId = invoiceId;
      const token = await createSnapToken({
        order_id: midtransOrderId,
        gross_amount: calculatedPrice,
        customer_details: {
          first_name: data.nama_penyewa,
          email: auth.user.email || '',
        }
      });
      if (token) {
        snapToken = token;
        paymentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      }
    }

    const { data: newTransaksi, error: insertError } = await supabaseAdmin.from('transaksi')
      .insert({
        ...data,
        user_id: auth.user.id,
        invoice_id: invoiceId,
        tanggal_mulai_sewa: data.tanggal_mulai,
        jam_mulai_sewa: data.jam_mulai,
        durasi_hari: data.durasi_hari,
        tanggal_selesai_sewa: tanggal_selesai_sewa,
        total_harga: calculatedPrice,
        status,
        nik_penyewa: encryptedNik,
        no_hp_penyewa: encryptedHp,
        snap_token: snapToken,
        midtrans_order_id: midtransOrderId,
        payment_deadline: paymentDeadline,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Create transaction error:', insertError);
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'CREATE',
      entitas: 'transaksi',
      entitas_id: newTransaksi.id,
      deskripsi: `Created transaction ${invoiceId}`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ success: true, data: newTransaksi }, { status: 201 });

  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
