/**
 * Per-user sliding-window rate limiter for the generation endpoints — guards
 * against abuse and runaway AI cost.
 *
 * In-memory, so it is per-serverless-instance (best-effort). For strict global
 * limits, back this with Upstash/Redis; the call sites don't change.
 */

const buckets = new Map<string, number[]>();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/** Default: 12 generations per minute per user. */
export function rateLimit(
  key: string,
  limit = 12,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    const oldest = hits[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}
