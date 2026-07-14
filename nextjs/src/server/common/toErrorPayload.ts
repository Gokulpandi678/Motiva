import { AppError } from './errors';
import { logger } from '../logger';

export interface ErrorPayload {
  statusCode: number;
  message: string;
  details?: unknown;
}

/** Postgres SQLSTATE error codes we handle specially. */
const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

interface PgError extends Error {
  code: string;
  detail?: string;
  constraint?: string;
  table?: string;
}

function isPgError(err: unknown): err is PgError {
  return err instanceof Error && typeof (err as { code?: unknown }).code === 'string';
}

/**
 * The single place that turns a thrown error into `{ statusCode, message, details? }`
 * — shared by REST route handlers (`handleRouteError`, wraps this in a
 * `NextResponse`) and Server Actions (`runAction`, wraps this in a returned
 * object instead of throwing, since Next.js strips thrown error messages in
 * production builds). Same logic the old Express `errorHandler` middleware
 * had in one place.
 */
export function toErrorPayload(err: unknown, context: { path: string; method: string }): ErrorPayload {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message, details: err.details };
  }

  if (isPgError(err)) {
    if (err.code === UNIQUE_VIOLATION) {
      return {
        statusCode: 409,
        message: 'A record with this value already exists',
        details: { constraint: err.constraint },
      };
    }
    if (err.code === FOREIGN_KEY_VIOLATION) {
      return {
        statusCode: 409,
        message: 'This action conflicts with a related record',
        details: { constraint: err.constraint },
      };
    }
  }

  logger.error('Unhandled error', {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    ...context,
  });

  return { statusCode: 500, message: 'Internal server error' };
}
