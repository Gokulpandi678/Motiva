import { withErrors } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { authService } from '@/server/auth/auth.service';

export const runtime = 'nodejs';

function bearerToken(authorizationHeader: string | null): string | undefined {
  return authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice('Bearer '.length) : undefined;
}

export const POST = withErrors(async (request) => {
  const accessToken = bearerToken(request.headers.get('authorization'));
  const logoutUrl = authService.buildLogoutUrl(accessToken);
  return apiSuccess({ logoutUrl });
});
