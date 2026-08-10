import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { validateCSRF } from '@/lib/security/csrf';
import { requireRole } from '@/lib/security/rbac';
import { createProdukSchema } from '@/lib/validations/data';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    const { data: produk, error } = await supabaseAdmin.from('produk')
      .select('*')
      .eq('is_active', true);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: produk }, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
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
    const validatedData = createProdukSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const slug = validatedData.data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    const { data: newProduk, error } = await supabaseAdmin.from('produk')
      .insert({
        ...validatedData.data,
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('Create product error:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'CREATE',
      entitas: 'produk',
      entitas_id: newProduk.id,
      deskripsi: `Created product: ${newProduk.nama}`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ success: true, data: newProduk }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
