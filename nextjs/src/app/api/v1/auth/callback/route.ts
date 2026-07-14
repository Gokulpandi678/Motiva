import { NextResponse } from 'next/server';
import { withErrors } from '@/server/http/route';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { callbackQuerySchema } from '@/server/validation/auth.validation';
import { authService } from '@/server/auth/auth.service';
import { env } from '@/server/env';

export const runtime = 'nodejs';

export const GET = withErrors(async (request) => {
  const { code, state, error, error_description: errorDescription } = parseWith(
    callbackQuerySchema,
    searchParamsToObject(request.nextUrl.searchParams),
  );

  if (error || !code || !state) {
    const message = errorDescription ?? error ?? 'Missing code or state';
    const redirectUrl = new URL('/auth/callback', env.WEB_APP_URL);
    redirectUrl.hash = `error=${encodeURIComponent(message)}`;
    return NextResponse.redirect(redirectUrl.toString());
  }

  const { accessToken, refreshToken } = await authService.authenticateWithCode(code, state);

  const redirectUrl = new URL('/auth/callback', env.WEB_APP_URL);
  redirectUrl.hash = `access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
  return NextResponse.redirect(redirectUrl.toString());
});
