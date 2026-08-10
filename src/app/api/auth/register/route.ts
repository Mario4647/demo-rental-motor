import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { rateLimitAsync, AUTH_LIMIT } from '@/lib/security/rateLimiter';
import { encrypt } from '@/lib/security/encryption';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const { allowed, retryAfter } = await rateLimitAsync(req, AUTH_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validatedData.error.format() }, { status: 400 });
    }

    const { email, password, nama_lengkap, nik, no_hp } = validatedData.data;

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Failed to register user' }, { status: 400 });
    }

    const userId = authData.user.id;

    // Encrypt sensitive data
    const encryptedNIK = encrypt(nik);
    const encryptedNoHp = encrypt(no_hp);

    // Get service client to bypass RLS for profile creation (or configure trigger)
    const { createServiceClient: getAdmin } = await import('@/lib/supabase/server');

    // Insert into profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      email,
      nama_lengkap,
      nik: encryptedNIK,
      no_hp: encryptedNoHp,
      role: 'user',
    });

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      user_nama: nama_lengkap,
      user_role: 'user',
      aksi: 'LOGIN', // As requested: Log audit: LOGIN action
      entitas: 'auth',
      entitas_id: userId,
      deskripsi: 'User registration and login',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: userId, email, nama_lengkap } 
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
