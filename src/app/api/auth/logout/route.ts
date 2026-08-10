import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/security/rbac';

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser(req);
    
    if (!auth) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    
    // Log audit before logout
    await supabaseAdmin.from('audit_logs').insert({
      user_id: auth.user.id,
      user_nama: auth.profile.nama_lengkap,
      user_role: auth.profile.role,
      aksi: 'SECURITY',
      entitas: 'auth',
      entitas_id: auth.user.id,
      deskripsi: 'User logged out',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
