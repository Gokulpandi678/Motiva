/**
 * Minimal migration runner — unchanged from the Express app's version, just
 * relocated. Plain SQL files in `db/migrations/`, applied in filename order,
 * each wrapped in a transaction, tracked in a `schema_migrations` table so
 * re-running this script only applies what's new.
 *
 * Usage: npm run db:migrate
 *
 * Run via `tsx` directly (not through Next.js), so — unlike the rest of the
 * server code — env vars aren't auto-loaded and must be brought in here.
 */
import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pool, withTransaction } from './pool';
import { logger } from '../logger';

const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "schema_migrations" (
      "name" TEXT PRIMARY KEY,
      "appliedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await pool.query<{ name: string }>(`SELECT "name" FROM "schema_migrations"`);
  return new Set(result.rows.map((row) => row.name));
}

async function run(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  let ranCount = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    logger.info(`Applying migration: ${file}`);

    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query(`INSERT INTO "schema_migrations" ("name") VALUES ($1)`, [file]);
    });

    ranCount += 1;
  }

  if (ranCount === 0) {
    logger.info('No new migrations to apply.');
  } else {
    logger.info(`Applied ${ranCount} migration(s).`);
  }

  await pool.end();
}

run().catch((error) => {
  logger.error('Migration failed', { error });
  process.exit(1);
});
