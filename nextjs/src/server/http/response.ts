import { NextResponse } from 'next/server';
import { toErrorPayload } from '../common/toErrorPayload';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Same shape as the old Express `sendSuccess` helper, just returning a `NextResponse` instead of writing to `res`. */
export function apiSuccess<T>(data: T, opts?: { status?: number; meta?: PaginationMeta }): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(opts?.meta ? { meta: opts.meta } : {}),
    },
    { status: opts?.status ?? 200 },
  );
}

/**
 * Every route handler funnels its catch block through this — the direct
 * equivalent of the old centralized Express `errorHandler` middleware, since
 * Next.js route handlers have no shared middleware chain to hang one off of.
 */
export function handleRouteError(err: unknown, path: string, method: string): NextResponse {
  const { statusCode, message, details } = toErrorPayload(err, { path, method });
  return NextResponse.json({ success: false, message, ...(details ? { details } : {}) }, { status: statusCode });
}
