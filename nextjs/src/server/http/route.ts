import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError } from '../common/errors';
import { authService, type AuthenticatedUser } from '../auth/auth.service';
import { handleRouteError } from './response';

function bearerToken(authorizationHeader: string | null): string | undefined {
  return authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice('Bearer '.length) : undefined;
}

/** Same check `requireAuth` middleware used to do: verify the WorkOS access token and resolve the local user. */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const token = bearerToken(request.headers.get('authorization'));
  if (!token) throw new UnauthorizedError('Missing access token');
  return authService.verifyAccessToken(token);
}

type RouteContext<P> = { params: Promise<P> };

/**
 * Wraps a route handler with the same error → JSON response translation the
 * old Express `errorHandler` middleware provided globally. Every route.ts
 * handler in this app is wrapped in one of these two, since Next.js route
 * handlers have no shared middleware chain to hang that behavior off of.
 */
export function withErrors<P = Record<string, string>>(
  handler: (request: NextRequest, ctx: RouteContext<P>) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ctx: RouteContext<P>): Promise<NextResponse> => {
    try {
      return await handler(request, ctx);
    } catch (error) {
      return handleRouteError(error, request.nextUrl.pathname, request.method);
    }
  };
}

/** Same as `withErrors`, but resolves the authenticated user first (equivalent of `apiRouter.use(requireAuth)` mounted ahead of every non-auth route). */
export function withAuth<P = Record<string, string>>(
  handler: (request: NextRequest, ctx: RouteContext<P> & { user: AuthenticatedUser }) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ctx: RouteContext<P>): Promise<NextResponse> => {
    try {
      const user = await requireAuth(request);
      return await handler(request, { ...ctx, user });
    } catch (error) {
      return handleRouteError(error, request.nextUrl.pathname, request.method);
    }
  };
}
