import { randomUUID } from 'node:crypto';
import { query, queryOne, toTimestampParam } from '../db/pool';
import type { InteractionType } from '../common/enums';
import type { Relationship } from '../common/types/models';
import type { CreateRelationshipInput, UpdateRelationshipInput } from '../validation/relationship.validation';

export interface RelationshipFilter {
  interactionType?: InteractionType;
}

class RelationshipRepository {
  async create(userId: string, input: CreateRelationshipInput): Promise<Relationship> {
    const relationship = await queryOne<Relationship>(
      `INSERT INTO "relationships"
         ("id", "userId", "personName", "interactionType", "context", "notes", "followUpDate", "followUpDone", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW(), NOW())
       RETURNING *`,
      [
        randomUUID(),
        userId,
        input.personName,
        input.interactionType,
        input.context ?? null,
        input.notes ?? null,
        toTimestampParam(input.followUpDate) ?? null,
      ],
    );
    return relationship!;
  }

  async findMany(userId: string, filter: RelationshipFilter, skip: number, limit: number): Promise<Relationship[]> {
    const { clause, params } = this.buildWhere(userId, filter);
    return query<Relationship>(
      `SELECT * FROM "relationships"
       ${clause}
       ORDER BY "createdAt" DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, skip],
    );
  }

  async count(userId: string, filter: RelationshipFilter): Promise<number> {
    const { clause, params } = this.buildWhere(userId, filter);
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM "relationships" ${clause}`, params);
    return Number(row?.count ?? 0);
  }

  async findDueFollowUps(userId: string, asOf: Date, skip: number, limit: number): Promise<Relationship[]> {
    return query<Relationship>(
      `SELECT * FROM "relationships"
       WHERE "userId" = $1 AND "followUpDone" = false AND "followUpDate" <= $2
       ORDER BY "followUpDate" ASC
       LIMIT $3 OFFSET $4`,
      [userId, toTimestampParam(asOf), limit, skip],
    );
  }

  async countDueFollowUps(userId: string, asOf: Date): Promise<number> {
    const row = await queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM "relationships" WHERE "userId" = $1 AND "followUpDone" = false AND "followUpDate" <= $2`,
      [userId, toTimestampParam(asOf)],
    );
    return Number(row?.count ?? 0);
  }

  async findRecentForPeopleSearch(userId: string, searchTerm: string | undefined, fetchLimit: number): Promise<Relationship[]> {
    return query<Relationship>(
      `SELECT * FROM "relationships"
       WHERE "userId" = $1 AND ($2::text IS NULL OR "personName" ILIKE '%' || $2 || '%')
       ORDER BY "createdAt" DESC
       LIMIT $3`,
      [userId, searchTerm ?? null, fetchLimit],
    );
  }

  async findById(userId: string, id: string): Promise<Relationship | null> {
    return queryOne<Relationship>(`SELECT * FROM "relationships" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  async update(userId: string, id: string, input: UpdateRelationshipInput): Promise<Relationship> {
    const sets: string[] = [];
    const params: unknown[] = [];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`"${column}" = $${params.length}`);
    };

    if (input.personName !== undefined) set('personName', input.personName);
    if (input.interactionType !== undefined) set('interactionType', input.interactionType);
    if (input.context !== undefined) set('context', input.context);
    if (input.notes !== undefined) set('notes', input.notes);
    if (input.followUpDate !== undefined) set('followUpDate', toTimestampParam(input.followUpDate));
    if (input.followUpDone !== undefined) set('followUpDone', input.followUpDone);
    sets.push(`"updatedAt" = NOW()`);

    params.push(id, userId);
    const relationship = await queryOne<Relationship>(
      `UPDATE "relationships" SET ${sets.join(', ')} WHERE "id" = $${params.length - 1} AND "userId" = $${params.length} RETURNING *`,
      params,
    );
    return relationship!;
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "relationships" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  private buildWhere(userId: string, filter: RelationshipFilter): { clause: string; params: unknown[] } {
    if (!filter.interactionType) return { clause: `WHERE "userId" = $1`, params: [userId] };
    return { clause: `WHERE "userId" = $1 AND "interactionType" = $2`, params: [userId, filter.interactionType] };
  }
}

export const relationshipRepository = new RelationshipRepository();
