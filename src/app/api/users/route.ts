import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/security/rbac';

export async function GET(req: Request) {
  try {
    const auth = await requireRole(req, ['admin']);
    if (!auth) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const roleParam = url.searchParams.get('role');

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin.from('profiles').select('id, email, nama_lengkap, role, created_at');

    if (roleParam && ['user', 'karyawan', 'admin'].includes(roleParam)) {
      query = query.eq('role', roleParam);
    }

    const { data: users, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // NIK and no_hp are intentionally excluded from the select to effectively mask them
    // If needed, they could be fetched and returned as '***'
    const safeUsers = users.map(u => ({ ...u, nik: '***', no_hp: '***' }));

    return NextResponse.json({ success: true, data: safeUsers }, { status: 200 });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
