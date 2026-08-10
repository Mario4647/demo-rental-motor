import { createClient, createServiceClient } from '../supabase/server';

export type Permission = 
  | 'read:products' | 'write:products' 
  | 'read:transactions' | 'write:transactions' 
  | 'manage:users' | 'manage:settings';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ['read:products', 'write:products', 'read:transactions', 'write:transactions', 'manage:users', 'manage:settings'],
  karyawan: ['read:products', 'read:transactions', 'write:transactions'],
  user: ['read:products']
};

export function checkPermission(userRole: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

export async function requireRole(req: Request, allowedRoles: string[]): Promise<{ user: any; profile: any } | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const supabaseAdmin = createServiceClient();
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    return null;
  }

  return { user, profile };
}

export async function getAuthUser(req: Request): Promise<{ user: any; profile: any } | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const supabaseAdmin = createServiceClient();
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
