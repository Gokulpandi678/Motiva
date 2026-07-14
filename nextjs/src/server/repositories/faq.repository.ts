import { randomUUID } from 'node:crypto';
import { query, queryOne } from '../db/pool';
import type { Faq } from '../common/types/models';
import type { UpdateFaqInput } from '../validation/faq.validation';

export interface FaqFilter {
  search?: string;
}

class FaqRepository {
  async upsertForTicket(userId: string, ticketId: string, question: string, answer: string): Promise<Faq> {
    const faq = await queryOne<Faq>(
      `INSERT INTO "faqs" ("id", "userId", "question", "answer", "ticketId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("ticketId") DO UPDATE SET "question" = EXCLUDED."question", "answer" = EXCLUDED."answer", "updatedAt" = NOW()
       RETURNING *`,
      [randomUUID(), userId, question, answer, ticketId],
    );
    return faq!;
  }

  async findMany(userId: string, filter: FaqFilter, skip: number, limit: number): Promise<Faq[]> {
    const { clause, params } = this.buildWhere(userId, filter);
    return query<Faq>(
      `SELECT * FROM "faqs" ${clause} ORDER BY "createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, skip],
    );
  }

  async count(userId: string, filter: FaqFilter): Promise<number> {
    const { clause, params } = this.buildWhere(userId, filter);
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM "faqs" ${clause}`, params);
    return Number(row?.count ?? 0);
  }

  async findById(userId: string, id: string): Promise<Faq | null> {
    return queryOne<Faq>(`SELECT * FROM "faqs" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  async findByTicketId(userId: string, ticketId: string): Promise<Faq | null> {
    return queryOne<Faq>(`SELECT * FROM "faqs" WHERE "ticketId" = $1 AND "userId" = $2`, [ticketId, userId]);
  }

  async update(userId: string, id: string, input: UpdateFaqInput): Promise<Faq> {
    const sets: string[] = [];
    const params: unknown[] = [];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`"${column}" = $${params.length}`);
    };

    if (input.question !== undefined) set('question', input.question);
    if (input.answer !== undefined) set('answer', input.answer);
    sets.push(`"updatedAt" = NOW()`);

    params.push(id, userId);
    const faq = await queryOne<Faq>(
      `UPDATE "faqs" SET ${sets.join(', ')} WHERE "id" = $${params.length - 1} AND "userId" = $${params.length} RETURNING *`,
      params,
    );
    return faq!;
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "faqs" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  private buildWhere(userId: string, filter: FaqFilter): { clause: string; params: unknown[] } {
    if (!filter.search) return { clause: `WHERE "userId" = $1`, params: [userId] };
    return {
      clause: `WHERE "userId" = $1 AND ("question" ILIKE '%' || $2 || '%' OR "answer" ILIKE '%' || $2 || '%')`,
      params: [userId, filter.search],
    };
  }
}

export const faqRepository = new FaqRepository();
