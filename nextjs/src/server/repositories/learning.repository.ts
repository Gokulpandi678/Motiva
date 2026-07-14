import { randomUUID } from 'node:crypto';
import { query, queryOne } from '../db/pool';
import { resolveTagIds } from '../common/resolveTags';
import type { Learning, Tag } from '../common/types/models';
import type { CreateLearningInput, UpdateLearningInput } from '../validation/learning.validation';

export interface LearningWithTags extends Learning {
  tags: Tag[];
}

export interface LearningFilter {
  tag?: string;
  domain?: string;
  maxConfidence?: number;
}

interface WhereClause {
  clause: string;
  params: unknown[];
}

class LearningRepository {
  async create(userId: string, input: CreateLearningInput): Promise<LearningWithTags> {
    const tagIds = await resolveTagIds(userId, input.tags);
    const id = randomUUID();

    const learning = await queryOne<Learning>(
      `INSERT INTO "learnings" ("id", "userId", "title", "domain", "source", "notes", "confidence", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [id, userId, input.title, input.domain, input.source ?? null, input.notes ?? null, input.confidence],
    );

    await this.setTags(id, tagIds);

    const [withTags] = await this.attachTags([learning!]);
    return withTags!;
  }

  async findMany(userId: string, filter: LearningFilter, skip: number, limit: number): Promise<LearningWithTags[]> {
    const { clause, params } = this.buildWhere(userId, filter);
    const rows = await query<Learning>(
      `SELECT * FROM "learnings"
       ${clause}
       ORDER BY "createdAt" DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, skip],
    );
    return this.attachTags(rows);
  }

  async count(userId: string, filter: LearningFilter): Promise<number> {
    const { clause, params } = this.buildWhere(userId, filter);
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM "learnings" ${clause}`, params);
    return Number(row?.count ?? 0);
  }

  async findById(userId: string, id: string): Promise<LearningWithTags | null> {
    const learning = await queryOne<Learning>(`SELECT * FROM "learnings" WHERE "id" = $1 AND "userId" = $2`, [
      id,
      userId,
    ]);
    if (!learning) return null;
    const [withTags] = await this.attachTags([learning]);
    return withTags!;
  }

  async update(userId: string, id: string, input: UpdateLearningInput): Promise<LearningWithTags> {
    const tagIds = input.tags ? await resolveTagIds(userId, input.tags) : undefined;

    const sets: string[] = [];
    const params: unknown[] = [];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`"${column}" = $${params.length}`);
    };

    if (input.title !== undefined) set('title', input.title);
    if (input.domain !== undefined) set('domain', input.domain);
    if (input.source !== undefined) set('source', input.source);
    if (input.notes !== undefined) set('notes', input.notes);
    if (input.confidence !== undefined) set('confidence', input.confidence);
    sets.push(`"updatedAt" = NOW()`);

    params.push(id, userId);
    const learning = await queryOne<Learning>(
      `UPDATE "learnings" SET ${sets.join(', ')} WHERE "id" = $${params.length - 1} AND "userId" = $${params.length} RETURNING *`,
      params,
    );
    if (!learning) throw new Error(`Learning ${id} not found`);

    if (tagIds) {
      await this.setTags(id, tagIds);
    }

    const [withTags] = await this.attachTags([learning]);
    return withTags!;
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "learnings" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  private async setTags(learningId: string, tagIds: string[]): Promise<void> {
    await query(`DELETE FROM "_LearningToTag" WHERE "A" = $1`, [learningId]);
    for (const tagId of tagIds) {
      await query(
        `INSERT INTO "_LearningToTag" ("A", "B") VALUES ($1, $2) ON CONFLICT ("A", "B") DO NOTHING`,
        [learningId, tagId],
      );
    }
  }

  private async attachTags(learnings: Learning[]): Promise<LearningWithTags[]> {
    if (learnings.length === 0) return [];
    const ids = learnings.map((learning) => learning.id);

    const tagRows = await query<Tag & { learningId: string }>(
      `SELECT tag.*, lt."A" AS "learningId"
       FROM "_LearningToTag" lt
       JOIN "tags" tag ON tag."id" = lt."B"
       WHERE lt."A" = ANY($1)`,
      [ids],
    );

    const tagsByLearning = new Map<string, Tag[]>();
    for (const { learningId, ...tag } of tagRows) {
      const list = tagsByLearning.get(learningId) ?? [];
      list.push(tag);
      tagsByLearning.set(learningId, list);
    }

    return learnings.map((learning) => ({
      ...learning,
      tags: tagsByLearning.get(learning.id) ?? [],
    }));
  }

  private buildWhere(userId: string, filter: LearningFilter): WhereClause {
    const conditions: string[] = [`"userId" = $1`];
    const params: unknown[] = [userId];

    if (filter.tag) {
      params.push(filter.tag.toLowerCase());
      conditions.push(
        `"id" IN (SELECT lt."A" FROM "_LearningToTag" lt JOIN "tags" tag ON tag."id" = lt."B" WHERE tag."name" = $${params.length})`,
      );
    }
    if (filter.domain) {
      params.push(filter.domain);
      conditions.push(`"domain" ILIKE $${params.length}`);
    }
    if (filter.maxConfidence !== undefined) {
      params.push(filter.maxConfidence);
      conditions.push(`"confidence" <= $${params.length}`);
    }

    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params,
    };
  }
}

export const learningRepository = new LearningRepository();
