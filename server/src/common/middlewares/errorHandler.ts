import type { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger';
import { AppError } from '../errors';

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

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (isPgError(err)) {
    if (err.code === UNIQUE_VIOLATION) {
      res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        details: { constraint: err.constraint },
      });
      return;
    }
    if (err.code === FOREIGN_KEY_VIOLATION) {
      res.status(409).json({
        success: false,
        message: 'This action conflicts with a related record',
        details: { constraint: err.constraint },
      });
      return;
    }
  }

  logger.error('Unhandled error', {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({ success: false, message: 'Internal server error' });
}
