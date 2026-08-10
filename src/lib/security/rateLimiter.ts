import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client. If env vars are missing, this will fail or we can mock it.
// To prevent total app failure if UPSTASH_REDIS_REST_URL is missing, we create a lazy initialized mock if needed.

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Fallback in-memory map if Redis is not configured (only for dev/testing, not reliable for prod)
const fallbackMemory = new Map<string, number>();
function mockRateLimit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  const reset = fallbackMemory.get(`${key}:reset`) || (now + windowSec * 1000);
  if (now > reset) {
    fallbackMemory.delete(key);
    fallbackMemory.set(`${key}:reset`, now + windowSec * 1000);
  }
  const count = (fallbackMemory.get(key) || 0) + 1;
  fallbackMemory.set(key, count);
  return {
    success: count <= limit,
    reset: fallbackMemory.get(`${key}:reset`) as number,
  };
}

export const AUTH_LIMIT = { limit: 5, window: '60 s' };
export const USER_LIMIT = { limit: 30, window: '60 s' };
export const ADMIN_LIMIT = { limit: 60, window: '60 s' };
export const TRANSACTION_LIMIT = { limit: 3, window: '60 s' };

export async function rateLimitAsync(req: Request, limitConfig: { limit: number; window: string }): Promise<{ allowed: boolean; retryAfter?: number }> {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
  const url = new URL(req.url);
  const key = `ratelimit:${ip}:${url.pathname}`;

  if (redis) {
    try {
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limitConfig.limit, limitConfig.window as any),
        analytics: true,
      });

      const { success, reset } = await ratelimit.limit(key);
      if (!success) {
        return { allowed: false, retryAfter: Math.ceil((reset - Date.now()) / 1000) };
      }
      return { allowed: true };
    } catch (error) {
      console.error('Rate limit error (fail-closed):', error);
      return { allowed: false, retryAfter: 60 }; // Fail closed: block request
    }
  }

  // Redis not configured -> fail-closed
  console.error('Rate limit fail-closed: Redis is not configured');
  return { allowed: false, retryAfter: 60 };
}

// For synchronous backwards compatibility where needed (though async is preferred)
// Note: Upstash is inherently async, so if called synchronously it might not block properly.
// The API routes should be updated to use rateLimitAsync instead.
export function rateLimit(req: Request, limitConfig: { limit: number; windowMs: number }): { allowed: boolean; retryAfter?: number } {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
  const url = new URL(req.url);
  const key = `ratelimit:${ip}:${url.pathname}`;
  
  const { success, reset } = mockRateLimit(key, limitConfig.limit, limitConfig.windowMs / 1000);
  if (!success) {
    return { allowed: false, retryAfter: Math.ceil((reset - Date.now()) / 1000) };
  }
  return { allowed: true };
}
