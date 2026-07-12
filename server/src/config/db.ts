import { Pool, type PoolClient, types } from 'pg';
import { env } from './env';

// Postgres columns here are `timestamp without time zone`, always written in a
// UTC session (confirmed via `SHOW timezone`). `pg` otherwise parses these
// naive strings using the Node process's local timezone — which is NOT UTC in
// this deployment — silently shifting every date. Force UTC interpretation so
// a value written as "now in UTC" reads back as the same instant, regardless
// of what timezone the Node process happens to run in.
const TIMESTAMP_OID = 1114;
types.setTypeParser(TIMESTAMP_OID, (value: string) => new Date(`${value.replace(' ', 'T')}Z`));

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * `pg` serializes a bound `Date` parameter using the Node process's LOCAL
 * timezone (IST here, not UTC) when writing to a `timestamp without time
 * zone` column — the write-side mirror of the read-side issue above. Always
 * pass caller-supplied dates through this before binding them as a query
 * parameter; an explicit 'Z'-suffixed ISO string is interpreted correctly
 * against the UTC session regardless of serialization quirks.
 */
export function toTimestampParam(value: Date | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return value.toISOString();
}

/** Runs a query and returns all rows. */
export async function query<T = unknown>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

/** Runs a query and returns the first row, or null if there were none. */
export async function queryOne<T = unknown>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Runs a query and returns the number of rows affected (for UPDATE/DELETE). */
export async function queryRowCount(text: string, params: unknown[] = []): Promise<number> {
  const result = await pool.query(text, params);
  return result.rowCount ?? 0;
}

/** Runs `fn` inside a BEGIN/COMMIT block, rolling back on any thrown error. */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
