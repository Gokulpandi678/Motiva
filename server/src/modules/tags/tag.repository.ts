import { query, queryOne, withTransaction } from '../../config/db';
import type { Tag } from '../../common/types/models';

export interface TagWithUsage {
  id: string;
  name: string;
  createdAt: Date;
  ticketCount: number;
  learningCount: number;
  usageCount: number;
}

class TagRepository {
  async search(userId: string, searchTerm: string | undefined, limit: number): Promise<TagWithUsage[]> {
    const rows = await query<{
      id: string;
      name: string;
      createdAt: Date;
      ticketCount: number;
      learningCount: number;
    }>(
      `SELECT
         t."id", t."name", t."createdAt",
         COUNT(DISTINCT tt."B")::int AS "ticketCount",
         COUNT(DISTINCT lt."A")::int AS "learningCount"
       FROM "tags" t
       LEFT JOIN "_TagToTicket" tt ON tt."A" = t."id"
       LEFT JOIN "_LearningToTag" lt ON lt."B" = t."id"
       WHERE t."userId" = $1 AND ($2::text IS NULL OR t."name" ILIKE '%' || $2 || '%')
       GROUP BY t."id", t."name", t."createdAt"
       ORDER BY (COUNT(DISTINCT tt."B") + COUNT(DISTINCT lt."A")) DESC, t."name" ASC
       LIMIT $3`,
      [userId, searchTerm?.toLowerCase() ?? null, limit],
    );

    return rows.map((row) => ({
      ...row,
      usageCount: row.ticketCount + row.learningCount,
    }));
  }

  async findById(userId: string, id: string): Promise<Tag | null> {
    return queryOne<Tag>(`SELECT * FROM "tags" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  async findByName(userId: string, name: string): Promise<Tag | null> {
    return queryOne<Tag>(`SELECT * FROM "tags" WHERE "name" = $1 AND "userId" = $2`, [name, userId]);
  }

  async rename(userId: string, id: string, name: string): Promise<Tag> {
    const tag = await queryOne<Tag>(`UPDATE "tags" SET "name" = $3 WHERE "id" = $1 AND "userId" = $2 RETURNING *`, [
      id,
      userId,
      name,
    ]);
    if (!tag) throw new Error(`Tag ${id} not found`);
    return tag;
  }

  /** Reassigns every ticket/learning on `sourceId` onto `targetId` (both already confirmed to belong to `userId`), then removes the source tag. */
  async merge(userId: string, sourceId: string, targetId: string): Promise<Tag> {
    return withTransaction(async (client) => {
      const ticketRows = await client.query<{ B: string }>(
        `SELECT tt."B" FROM "_TagToTicket" tt JOIN "tags" t ON t."id" = tt."A" WHERE tt."A" = $1 AND t."userId" = $2`,
        [sourceId, userId],
      );
      const learningRows = await client.query<{ A: string }>(
        `SELECT lt."A" FROM "_LearningToTag" lt JOIN "tags" t ON t."id" = lt."B" WHERE lt."B" = $1 AND t."userId" = $2`,
        [sourceId, userId],
      );

      for (const { B: ticketId } of ticketRows.rows) {
        await client.query(
          `INSERT INTO "_TagToTicket" ("A", "B") VALUES ($1, $2) ON CONFLICT ("A", "B") DO NOTHING`,
          [targetId, ticketId],
        );
      }

      for (const { A: learningId } of learningRows.rows) {
        await client.query(
          `INSERT INTO "_LearningToTag" ("A", "B") VALUES ($1, $2) ON CONFLICT ("A", "B") DO NOTHING`,
          [learningId, targetId],
        );
      }

      await client.query(`DELETE FROM "tags" WHERE "id" = $1 AND "userId" = $2`, [sourceId, userId]);

      const result = await client.query<Tag>(`SELECT * FROM "tags" WHERE "id" = $1 AND "userId" = $2`, [
        targetId,
        userId,
      ]);
      const target = result.rows[0];
      if (!target) throw new Error(`Tag ${targetId} not found`);
      return target;
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "tags" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }
}

export const tagRepository = new TagRepository();
