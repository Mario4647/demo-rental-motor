import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { validateCSRF } from '@/lib/security/csrf';
import { requireRole, getAuthUser } from '@/lib/security/rbac';
import { updateTransaksiStatusSchema } from '@/lib/validations/data';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    const { data: transaksi, error } = await supabaseAdmin.from('transaksi')
      .select('*, produk(*), unit(*)')
      .eq('id', id)
      .single();

    if (error || !transaksi) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (auth.profile.role === 'user' && transaksi.user_id !== auth.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: transaksi }, { status: 200 });
  } catch (error) {
    console.error('Get transaction detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!validateCSRF(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const auth = await requireRole(req, ['admin', 'karyawan']);
    if (!auth) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateTransaksiStatusSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const { status: newStatus } = validatedData.data;

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    const { data: currentTx, error: fetchError } = await supabaseAdmin.from('transaksi')
      .select('status, id, unit_id')
      .eq('id', id)
      .single();

    if (fetchError || !currentTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const oldStatus = currentTx.status;

    // State machine validation
    const validTransitions: Record<string, string[]> = {
      pending: ['menunggu_pembayaran', 'dibatalkan'],
      menunggu_pembayaran: ['dibayar', 'dibatalkan'],
      dibayar: ['qr_scanned'],
      qr_scanned: ['berlangsung'],
      berlangsung: ['selesai'],
    };

    let isValidTransition = false;
    if (validTransitions[oldStatus] && validTransitions[oldStatus].includes(newStatus)) {
      isValidTransition = true;
    } else if (newStatus === 'refund' && auth.profile.role === 'admin') {
      isValidTransition = true;
    }

    if (!isValidTransition) {
      return NextResponse.json({ error: `Invalid status transition from ${oldStatus} to ${newStatus}` }, { status: 400 });
    }

    const updatePayload: any = { status: newStatus };

    if (newStatus === 'selesai' || newStatus === 'dibatalkan') {
      // identitas retention should be updated in identitas_penyewa table, not transaksi.
    }

    const { error: updateError } = await supabaseAdmin.from('transaksi')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    // Release unit if necessary
    if ((newStatus === 'selesai' || newStatus === 'dibatalkan') && currentTx.unit_id) {
       await supabaseAdmin.from('unit').update({ status: 'tersedia' }).eq('id', currentTx.unit_id);
       // Note: Depending on schema, might also need to increment produk.jumlah_unit_tersedia
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'UPDATE',
      entitas: 'transaksi',
      entitas_id: id,
      deskripsi: `Changed status from ${oldStatus} to ${newStatus}`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ success: true, message: 'Status updated' }, { status: 200 });

  } catch (error) {
    console.error('Update transaction status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
