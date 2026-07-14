import { query } from '../db/pool';

export interface TagActivity {
  name: string;
  ticketDates: Date[];
  learningDates: Date[];
}

class SkillRepository {
  async findAllTagActivity(userId: string): Promise<TagActivity[]> {
    const tags = await query<{ id: string; name: string }>(`SELECT "id", "name" FROM "tags" WHERE "userId" = $1`, [
      userId,
    ]);

    const ticketDateRows = await query<{ tagId: string; createdAt: Date }>(
      `SELECT tt."A" AS "tagId", t."createdAt"
       FROM "_TagToTicket" tt
       JOIN "tickets" t ON t."id" = tt."B"
       WHERE t."userId" = $1`,
      [userId],
    );
    const learningDateRows = await query<{ tagId: string; createdAt: Date }>(
      `SELECT lt."B" AS "tagId", l."createdAt"
       FROM "_LearningToTag" lt
       JOIN "learnings" l ON l."id" = lt."A"
       WHERE l."userId" = $1`,
      [userId],
    );

    const ticketDatesByTag = new Map<string, Date[]>();
    for (const row of ticketDateRows) {
      const list = ticketDatesByTag.get(row.tagId) ?? [];
      list.push(row.createdAt);
      ticketDatesByTag.set(row.tagId, list);
    }

    const learningDatesByTag = new Map<string, Date[]>();
    for (const row of learningDateRows) {
      const list = learningDatesByTag.get(row.tagId) ?? [];
      list.push(row.createdAt);
      learningDatesByTag.set(row.tagId, list);
    }

    return tags.map((tag) => ({
      name: tag.name,
      ticketDates: ticketDatesByTag.get(tag.id) ?? [],
      learningDates: learningDatesByTag.get(tag.id) ?? [],
    }));
  }
}

export const skillRepository = new SkillRepository();
