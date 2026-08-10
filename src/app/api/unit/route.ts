import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { validateCSRF } from '@/lib/security/csrf';
import { requireRole } from '@/lib/security/rbac';
import { createUnitSchema } from '@/lib/validations/data';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const produkId = url.searchParams.get('produk_id');
    
    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin.from('unit').select('*');
    
    if (produkId) {
      query = query.eq('produk_id', produkId);
    }

    const { data: units, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: units }, { status: 200 });
  } catch (error) {
    console.error('Get units error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!validateCSRF(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const auth = await requireRole(req, ['admin']);
    if (!auth) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createUnitSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    const { data: newUnit, error } = await supabaseAdmin.from('unit')
      .insert(validatedData.data)
      .select()
      .single();

    if (error) {
      console.error('Create unit error:', error);
      return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
    }

    // Update produk totals via RPC or sequential query
    const { data: produkData } = await supabaseAdmin.from('produk')
      .select('total_unit, jumlah_unit_tersedia')
      .eq('id', validatedData.data.produk_id)
      .single();

    if (produkData) {
      await supabaseAdmin.from('produk')
        .update({
          total_unit: (produkData.total_unit || 0) + 1,
          jumlah_unit_tersedia: (produkData.jumlah_unit_tersedia || 0) + 1
        })
        .eq('id', validatedData.data.produk_id);
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'CREATE',
      entitas: 'unit',
      entitas_id: newUnit.id,
      deskripsi: `Created unit for product ${validatedData.data.produk_id}`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ success: true, data: newUnit }, { status: 201 });

  } catch (error) {
    console.error('Create unit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
