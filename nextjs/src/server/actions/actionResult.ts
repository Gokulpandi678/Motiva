import { toErrorPayload } from '../common/toErrorPayload';
import { UnauthorizedError } from '../common/errors';
import { authService, type AuthenticatedUser } from '../auth/auth.service';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; details?: unknown };

/**
 * Server Actions round-trip return values through React's RSC serialization,
 * which — unlike `JSON.stringify` (what the REST path's `res.json()` uses) —
 * can carry a real `Date` instance back to the client as-is. Left alone,
 * that would make a ticket's `createdAt` a `Date` when it came from an
 * action but a `string` when it came from the REST endpoint: two different
 * wire shapes for what's supposed to be one API contract. This type mirrors
 * what `JSON.stringify` does to `T`, and `runAction` actually performs that
 * round-trip, so every action's return value matches the REST shape exactly.
 */
type Serialized<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? Serialized<U>[]
    : T extends object
      ? { [K in keyof T]: Serialized<T[K]> }
      : T;

/**
 * Runs a Server Action body and always *returns* (never throws) a result
 * object. Next.js redacts thrown error messages from Server Actions in
 * production builds — returning instead of throwing is what lets a toast
 * still show the exact same message (`"A tag named ... already exists"`,
 * etc.) that the REST path's `{ success: false, message }` body carries.
 */
export async function runAction<T>(name: string, fn: () => Promise<T>): Promise<ActionResult<Serialized<T>>> {
  try {
    const data = await fn();
    const serialized = (data === undefined ? undefined : JSON.parse(JSON.stringify(data))) as Serialized<T>;
    return { success: true, data: serialized };
  } catch (err) {
    const { message, details } = toErrorPayload(err, { path: `action:${name}`, method: 'ACTION' });
    return { success: false, message, details };
  }
}

/** Same check as `requireAuth` for route handlers — Server Actions get the token passed explicitly since there's no request object to read a header from. */
export async function requireAuthFromToken(accessToken: string | null | undefined): Promise<AuthenticatedUser> {
  if (!accessToken) throw new UnauthorizedError('Missing access token');
  return authService.verifyAccessToken(accessToken);
}
