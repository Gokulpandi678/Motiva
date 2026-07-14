import { decodeJwt, jwtVerify } from 'jose';
import { env } from '../env';
import { UnauthorizedError } from '../common/errors';
import type { User } from '../common/types/models';
import { oauthStateStore } from './oauthStateStore';
import { userRepository } from './user.repository';
import { workos, workosJwks } from './workos.client';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  workosUserId: string;
  email: string;
}

class AuthService {
  /** Starts a login attempt: generates PKCE + state, remembers the verifier server-side, returns the URL to redirect the browser to. */
  async buildAuthorizationUrl(): Promise<string> {
    const { url, state, codeVerifier } = await workos.userManagement.getAuthorizationUrlWithPKCE({
      provider: 'authkit',
      clientId: env.WORKOS_CLIENT_ID,
      redirectUri: env.WORKOS_REDIRECT_URI,
    });
    await oauthStateStore.save(state, codeVerifier);
    return url;
  }

  /** Exchanges the authorization code for tokens, verifying `state` against what `buildAuthorizationUrl` generated (CSRF protection). */
  async authenticateWithCode(code: string, state: string): Promise<TokenPair & { user: User }> {
    const codeVerifier = await oauthStateStore.consume(state);
    if (!codeVerifier) {
      throw new UnauthorizedError('This login link has expired or was already used — try signing in again');
    }

    const authResponse = await workos.userManagement.authenticateWithCode({
      code,
      codeVerifier,
      clientId: env.WORKOS_CLIENT_ID,
    });

    const user = await userRepository.upsertFromWorkosProfile({
      workosUserId: authResponse.user.id,
      email: authResponse.user.email,
      firstName: authResponse.user.firstName,
      lastName: authResponse.user.lastName,
      emailVerified: authResponse.user.emailVerified,
      profilePictureUrl: authResponse.user.profilePictureUrl,
    });

    return { accessToken: authResponse.accessToken, refreshToken: authResponse.refreshToken, user };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
      const refreshed = await workos.userManagement.authenticateWithRefreshToken({
        refreshToken,
        clientId: env.WORKOS_CLIENT_ID,
      });
      return { accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken };
    } catch {
      throw new UnauthorizedError('Session expired — please sign in again');
    }
  }

  /** Verifies signature + expiry against WorkOS's published JWKS (not a naive decode) and resolves the local user it belongs to. */
  async verifyAccessToken(accessToken: string): Promise<AuthenticatedUser> {
    let workosUserId: string;
    try {
      const { payload } = await jwtVerify(accessToken, workosJwks);
      if (typeof payload.sub !== 'string') throw new Error('Missing sub claim');
      workosUserId = payload.sub;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }

    const user = await userRepository.findByWorkosUserId(workosUserId);
    if (!user) throw new UnauthorizedError('User not found');

    return { id: user.id, workosUserId: user.workosUserId, email: user.email };
  }

  /** Best-effort: ends the WorkOS session if the access token is still decodable, otherwise just sends the browser home. */
  buildLogoutUrl(accessToken: string | undefined): string {
    if (!accessToken) return env.WEB_APP_URL;
    try {
      const claims = decodeJwt(accessToken);
      const sessionId = typeof claims.sid === 'string' ? claims.sid : undefined;
      if (!sessionId) return env.WEB_APP_URL;
      return workos.userManagement.getLogoutUrl({ sessionId, returnTo: env.WEB_APP_URL });
    } catch {
      return env.WEB_APP_URL;
    }
  }
}

export const authService = new AuthService();
