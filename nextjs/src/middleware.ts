import { NextRequest, NextResponse } from 'next/server';

/**
 * Same in-memory fixed-window limiter `express-rate-limit` was providing
 * globally in front of the Express app (default: 300 requests / 15 minutes
 * per client). Like the old store, this only holds correctly for a single
 * running instance — the previous app had the identical limitation.
 */
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 300);

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function clientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
}

export function middleware(request: NextRequest): NextResponse {
  const key = clientKey(request);
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    return NextResponse.json(
      { success: false, message: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((bucket.resetAt - now) / 1000)) } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};
