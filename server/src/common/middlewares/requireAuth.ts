import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { authService } from '../../modules/auth/auth.service';

function bearerToken(authorizationHeader: string | undefined): string | undefined {
  return authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice('Bearer '.length) : undefined;
}

/** Verifies the access token's signature + expiry against WorkOS's JWKS and attaches `req.user`. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = bearerToken(req.headers.authorization);
  if (!token) {
    next(new UnauthorizedError('Missing access token'));
    return;
  }

  try {
    req.user = await authService.verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
