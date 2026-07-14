import { NextResponse } from 'next/server';
import { withErrors } from '@/server/http/route';
import { authService } from '@/server/auth/auth.service';

export const runtime = 'nodejs';

export const GET = withErrors(async () => {
  const url = await authService.buildAuthorizationUrl();
  return NextResponse.redirect(url);
});
