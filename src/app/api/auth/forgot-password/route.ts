import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { rateLimitAsync, AUTH_LIMIT } from '@/lib/security/rateLimiter';
import { forgotPasswordSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const { allowed, retryAfter } = await rateLimitAsync(req, AUTH_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    const body = await req.json();
    const validatedData = forgotPasswordSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { email } = validatedData.data;
    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    await supabase.auth.resetPasswordForEmail(email);

    // Always return success to prevent email enumeration
    return NextResponse.json({ 
      success: true, 
      message: 'Jika email terdaftar, link reset password akan dikirim' 
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
