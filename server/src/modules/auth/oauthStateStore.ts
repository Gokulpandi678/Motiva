import { env } from '../../config/env';

/**
 * Holds the PKCE `codeVerifier` for a pending login between `/auth/login`
 * (which generates it) and `/auth/callback` (which needs it back) — keyed by
 * the `state` value WorkOS round-trips through the redirect, so no cookie or
 * client-side storage is needed for this step at all.
 *
 * In-memory and per-process: fine for a single server instance. Running more
 * than one instance behind a load balancer needs a shared store instead (e.g.
 * Redis) — swap the implementation below without touching any caller.
 */
export interface OAuthStateStore {
  save(state: string, codeVerifier: string): Promise<void>;
  consume(state: string): Promise<string | null>;
}

interface StoredState {
  codeVerifier: string;
  expiresAt: number;
}

class InMemoryOAuthStateStore implements OAuthStateStore {
  private readonly states = new Map<string, StoredState>();

  async save(state: string, codeVerifier: string): Promise<void> {
    this.sweepExpired();
    this.states.set(state, { codeVerifier, expiresAt: Date.now() + env.OAUTH_STATE_TTL_SECONDS * 1000 });
  }

  async consume(state: string): Promise<string | null> {
    const entry = this.states.get(state);
    this.states.delete(state);
    if (!entry || entry.expiresAt < Date.now()) return null;
    return entry.codeVerifier;
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [state, entry] of this.states) {
      if (entry.expiresAt < now) this.states.delete(state);
    }
  }
}

export const oauthStateStore: OAuthStateStore = new InMemoryOAuthStateStore();
