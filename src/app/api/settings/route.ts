import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { validateCSRF } from '@/lib/security/csrf';
import { requireRole } from '@/lib/security/rbac';
import { updateSettingsSchema } from '@/lib/validations/data';

export async function GET() {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    const { data: settings, error } = await supabaseAdmin.from('app_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: settings || {} }, { status: 200 });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!validateCSRF(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const auth = await requireRole(req, ['admin']);
    if (!auth) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateSettingsSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    // Check if settings exist
    const { data: existing, error: fetchErr } = await supabaseAdmin.from('app_settings').select('id').maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabaseAdmin.from('app_settings')
        .update(validatedData.data)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin.from('app_settings')
        .insert(validatedData.data)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'UPDATE',
      entitas: 'settings',
      entitas_id: result.id,
      deskripsi: `Updated application settings`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
