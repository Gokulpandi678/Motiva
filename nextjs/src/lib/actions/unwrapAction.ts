import { ApiError } from '@/lib/api/client';
import type { ActionResult } from '@/server/actions/actionResult';

/**
 * Turns a Server Action's returned `ActionResult` back into the same
 * throw-an-`ApiError`-on-failure shape `requestItem`/`requestVoid` already
 * produced for the REST path, so every `useMutation` call site's existing
 * `onError` / `toast.error(... error instanceof ApiError ? error.message ...)`
 * logic works identically regardless of which path it's calling.
 */
export function unwrapAction<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw new ApiError(result.message, 0, result.details);
  }
  return result.data;
}
