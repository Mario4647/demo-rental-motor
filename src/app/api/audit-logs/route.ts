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
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const aksi = url.searchParams.get('aksi');
    const entitas = url.searchParams.get('entitas');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const supabase = await createClient();
    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin.from('audit_logs').select('*', { count: 'exact' });

    if (aksi) query = query.eq('aksi', aksi);
    if (entitas) query = query.eq('entitas', entitas);
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);

    const fromIdx = (page - 1) * limit;
    const toIdx = fromIdx + limit - 1;

    const { data: logs, error, count } = await query
      .order('created_at', { ascending: false })
      .range(fromIdx, toIdx);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: logs,
      meta: {
        page,
        limit,
        total: count,
        total_pages: count ? Math.ceil(count / limit) : 0
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
