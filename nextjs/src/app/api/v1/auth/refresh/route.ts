import { withErrors } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { refreshBodySchema } from '@/server/validation/auth.validation';
import { authService } from '@/server/auth/auth.service';

export const runtime = 'nodejs';

export const POST = withErrors(async (request) => {
  const { refreshToken } = parseWith(refreshBodySchema, await request.json());
  const tokens = await authService.refreshAccessToken(refreshToken);
  return apiSuccess(tokens);
});
