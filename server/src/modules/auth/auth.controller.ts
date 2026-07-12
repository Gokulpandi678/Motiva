import { URL } from 'node:url';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { UnauthorizedError } from '../../common/errors';
import { userRepository } from './user.repository';
import { authService } from './auth.service';
import type { CallbackQuery, RefreshBody } from './auth.validation';
import { env } from '../../config/env';

function bearerToken(authorizationHeader: string | undefined): string | undefined {
  return authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice('Bearer '.length) : undefined;
}

export const login = asyncHandler(async (_req, res) => {
  const url = await authService.buildAuthorizationUrl();
  res.redirect(url);
});

export const callback = asyncHandler(async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query as unknown as CallbackQuery;

  if (error || !code || !state) {
    const message = errorDescription ?? error ?? 'Missing code or state';
    const redirectUrl = new URL('/auth/callback', env.WEB_APP_URL);
    redirectUrl.hash = `error=${encodeURIComponent(message)}`;
    res.redirect(redirectUrl.toString());
    return;
  }

  const { accessToken, refreshToken } = await authService.authenticateWithCode(code, state);

  const redirectUrl = new URL('/auth/callback', env.WEB_APP_URL);
  redirectUrl.hash = `access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
  res.redirect(redirectUrl.toString());
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body as RefreshBody;
  const tokens = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, tokens);
});

export const logout = asyncHandler(async (req, res) => {
  const accessToken = bearerToken(req.headers.authorization);
  const logoutUrl = authService.buildLogoutUrl(accessToken);
  sendSuccess(res, { logoutUrl });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await userRepository.findById(req.user.id);
  if (!user) throw new UnauthorizedError('User not found');
  sendSuccess(res, user);
});
