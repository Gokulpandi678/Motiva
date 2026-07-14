import type { ZodType, ZodTypeDef } from 'zod';
import { ZodError } from 'zod';
import { ValidationError } from '../common/errors';

/** Flattens `?a=1&b=2` into a plain object the same way Express's default query parser handed schemas a plain object. */
export function searchParamsToObject(searchParams: URLSearchParams): Record<string, string> {
  return Object.fromEntries(searchParams.entries());
}

/**
 * Runs a Zod schema and rethrows as the same `ValidationError` (422,
 * `.flatten()` details) the old `validate()` middleware produced.
 *
 * Typed as `ZodType<T, ZodTypeDef, any>` rather than the shorter `ZodSchema<T>`
 * — with fields like `.default(10)`, the shorter alias lets TypeScript infer
 * `T` from the schema's *input* type too (where such a field is optional),
 * unioning it with `undefined` even though `.parse()` always returns the
 * output type. Pinning the input slot to `any` forces inference from the
 * output side only.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- deliberate: see comment above.
export function parseWith<T>(schema: ZodType<T, ZodTypeDef, any>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError('Validation failed', err.flatten());
    }
    throw err;
  }
}
