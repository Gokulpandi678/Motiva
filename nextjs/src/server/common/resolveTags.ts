import { randomUUID } from 'node:crypto';
import { query } from '../db/pool';

export function normalizeTagNames(tags: string[]): string[] {
  return Array.from(new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)));
}

/**
 * Ensures every tag name exists **for this user** (creating missing ones) and
 * returns their ids. Tags are namespaced per user (`tags_userId_name_key`),
 * so the same word can exist once per user rather than being a single global
 * vocabulary. The `DO UPDATE SET name = EXCLUDED.name` is a no-op write —
 * it's only there so `RETURNING id` also fires on the conflict path, giving
 * us the existing row's id in one round-trip instead of insert-then-select.
 */
export async function resolveTagIds(userId: string, tagNames: string[]): Promise<string[]> {
  const names = normalizeTagNames(tagNames);
  if (names.length === 0) return [];

  const ids: string[] = [];
  for (const name of names) {
    const row = await query<{ id: string }>(
      `INSERT INTO "tags" ("id", "userId", "name", "createdAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT ("userId", "name") DO UPDATE SET "name" = EXCLUDED."name"
       RETURNING "id"`,
      [randomUUID(), userId, name],
    );
    ids.push(row[0]!.id);
  }

  return ids;
}
