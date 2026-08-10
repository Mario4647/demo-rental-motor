import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { rateLimitAsync, ADMIN_LIMIT } from '@/lib/security/rateLimiter';
import { validateCSRF } from '@/lib/security/csrf';
import { requireRole } from '@/lib/security/rbac';
import { encrypt } from '@/lib/security/encryption';
import { registerStaffSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const { allowed, retryAfter } = await rateLimitAsync(req, ADMIN_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    if (!validateCSRF(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const auth = await requireRole(req, ['admin']);
    if (!auth) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = registerStaffSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const { email, password, nama_lengkap, no_hp, role } = validatedData.data;
    const nik = body.nik || '';

    const supabaseAdmin = await createServiceClient();
    
    // Create user via Supabase Auth Admin
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Admin Auth error:', authError);
      return NextResponse.json({ error: 'Failed to create staff user' }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // Encrypt sensitive data
    const encryptedNIK = nik ? encrypt(nik) : null;
    const encryptedNoHp = encrypt(no_hp);

    // Create profile
    const supabase = await createClient();
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: newUserId,
      email,
      nama_lengkap,
      nik: encryptedNIK,
      no_hp: encryptedNoHp,
      role: role,
    });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Clean up auth user if profile fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: 'Failed to create staff profile' }, { status: 500 });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'CREATE',
      entitas: 'users',
      entitas_id: newUserId,
      deskripsi: `Created staff account with role: ${role}`,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: newUserId, email, nama_lengkap, role } 
    }, { status: 201 });

  } catch (error) {
    console.error('Register staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
