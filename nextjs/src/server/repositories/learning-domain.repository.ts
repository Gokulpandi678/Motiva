import { query, queryRowCount } from '../db/pool';

export interface DomainActivity {
  domain: string;
  count: number;
  lastUsedAt: Date;
}

class LearningDomainRepository {
  async listDomains(userId: string, searchTerm: string | undefined): Promise<DomainActivity[]> {
    const rows = await query<{ domain: string; count: number; lastUsedAt: Date }>(
      `SELECT "domain", COUNT(*)::int AS count, MAX("createdAt") AS "lastUsedAt"
       FROM "learnings"
       WHERE "userId" = $1 AND ($2::text IS NULL OR "domain" ILIKE '%' || $2 || '%')
       GROUP BY "domain"`,
      [userId, searchTerm ?? null],
    );
    return rows;
  }

  async renameDomain(userId: string, from: string, to: string): Promise<number> {
    return queryRowCount(
      `UPDATE "learnings" SET "domain" = $3, "updatedAt" = NOW() WHERE "domain" = $1 AND "userId" = $2`,
      [from, userId, to],
    );
  }
}

export const learningDomainRepository = new LearningDomainRepository();
