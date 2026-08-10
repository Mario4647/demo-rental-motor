export function validateCSRF(req: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method)) {
    return true; // Safe methods, no CSRF validation needed
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean) as string[];

  let sourceDomain = '';
  if (origin) {
    sourceDomain = origin;
  } else if (referer) {
    try {
      sourceDomain = new URL(referer).origin;
    } catch {
      sourceDomain = '';
    }
  }

  if (!sourceDomain) return false;

  if (host) {
    const protocol = host.includes('localhost') ? 'http://' : 'https://';
    allowedOrigins.push(`${protocol}${host}`);
  }

  return allowedOrigins.some(allowed => allowed && sourceDomain.startsWith(allowed));
}
