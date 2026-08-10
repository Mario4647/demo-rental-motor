import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { rateLimitAsync, AUTH_LIMIT } from '@/lib/security/rateLimiter';
import { loginSchema } from '@/lib/validations/auth';
import { sendNewDeviceNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { allowed, retryAfter } = await rateLimitAsync(req, AUTH_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    const body = await req.json();
    const validatedData = loginSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const { email, password } = validatedData.data;

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Check login attempts from login_attempts table
    const { data: attemptRecord } = await supabaseAdmin.from('login_attempts')
      .select('*')
      .eq('email', email)
      .eq('ip_address', ipAddress)
      .single();

    if (attemptRecord && attemptRecord.is_blocked_until) {
      const blockedUntil = new Date(attemptRecord.is_blocked_until);
      if (blockedUntil > new Date()) {
         return NextResponse.json({ error: 'Account locked due to too many failed attempts' }, { status: 403 });
      } else {
         // Reset if lock expired
         await supabaseAdmin.from('login_attempts').update({ attempt_count: 0, is_blocked_until: null }).eq('id', attemptRecord.id);
      }
    }

    // Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      // Increment login attempts
      const currentAttempts = attemptRecord ? attemptRecord.attempt_count : 0;
      const newAttempts = currentAttempts + 1;
      let isBlockedUntil = null;
      
      if (newAttempts >= 5) {
        isBlockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min lock
      }

      if (attemptRecord) {
        await supabaseAdmin.from('login_attempts').update({ 
          attempt_count: newAttempts, 
          last_attempt_at: new Date().toISOString(),
          is_blocked_until: isBlockedUntil 
        }).eq('id', attemptRecord.id);
      } else {
        await supabaseAdmin.from('login_attempts').insert({
          email,
          ip_address: ipAddress,
          attempt_count: newAttempts,
          last_attempt_at: new Date().toISOString(),
          is_blocked_until: isBlockedUntil
        });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userId = authData.user.id;

    // Reset login attempts and get full profile
    if (attemptRecord) {
      await supabaseAdmin.from('login_attempts').update({ attempt_count: 0, is_blocked_until: null }).eq('id', attemptRecord.id);
    }
    
    const { data: profile, error: profileError } = await supabaseAdmin.from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, email, nama_lengkap, role')
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
    }

    // Log base login success audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      user_nama: profile.nama_lengkap,
      user_role: profile.role,
      aksi: 'LOGIN',
      entitas: 'auth',
      entitas_id: userId,
      deskripsi: 'User logged in successfully',
      ip_address: ipAddress,
    });

    // Determine if new device/IP
    const { count: ipHistoryCount } = await supabaseAdmin.from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('ip_address', ipAddress)
      .eq('aksi', 'LOGIN');

    // If it's a new IP (or first login ever), send email
    if (ipHistoryCount === 1) { // 1 because we just inserted the success log above
      const emailResult = await sendNewDeviceNotification(profile.email, profile.nama_lengkap, ipAddress, userAgent);
      
      if (emailResult.success) {
        await supabaseAdmin.from('audit_logs').insert({
          user_id: userId,
          user_nama: profile.nama_lengkap,
          user_role: profile.role,
          aksi: 'SECURITY',
          entitas: 'auth_notification',
          entitas_id: userId,
          deskripsi: 'Notifikasi login dari perangkat/IP baru BERHASIL terkirim via email',
          ip_address: ipAddress,
        });
      } else {
        await supabaseAdmin.from('audit_logs').insert({
          user_id: userId,
          user_nama: profile.nama_lengkap,
          user_role: profile.role,
          aksi: 'SECURITY',
          entitas: 'auth_notification',
          entitas_id: userId,
          deskripsi: `Notifikasi login dari perangkat/IP baru GAGAL terkirim: ${emailResult.error}`,
          ip_address: ipAddress,
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: profile.id, 
        email: profile.email, 
        nama_lengkap: profile.nama_lengkap, 
        role: profile.role 
      },
      session: authData.session
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
