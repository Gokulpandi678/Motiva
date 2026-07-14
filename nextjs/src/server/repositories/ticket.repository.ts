import { randomUUID } from 'node:crypto';
import { query, queryOne } from '../db/pool';
import type { CreateTicketInput, UpdateTicketInput } from '../validation/ticket.validation';
import type { TicketFilter, TicketWithRelations } from './ticket.types';
import type { Faq, Tag, Ticket } from '../common/types/models';
import { resolveTagIds } from '../common/resolveTags';

const SIMILARITY_THRESHOLD = 0.2;

interface SimilarTicketRow {
  id: string;
  sim: number;
}

/** Adds `resolvedAt`, which the service computes from a status transition — never supplied directly by callers. */
export type TicketUpdateData = UpdateTicketInput & { resolvedAt?: Date | null };

interface WhereClause {
  clause: string;
  params: unknown[];
}

class TicketRepository {
  async create(userId: string, input: Omit<CreateTicketInput, 'generateFaq'>): Promise<TicketWithRelations> {
    const tagIds = await resolveTagIds(userId, input.tags);
    const id = randomUUID();

    const ticket = await queryOne<Ticket>(
      `INSERT INTO "tickets"
         ("id", "userId", "title", "problem", "resolution", "status", "difficulty", "timeSpentMinutes", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [id, userId, input.title, input.problem, input.resolution ?? null, input.status, input.difficulty, input.timeSpentMinutes],
    );

    await this.setTags(id, tagIds);

    const [withRelations] = await this.attachRelations([ticket!]);
    return withRelations!;
  }

  async findMany(userId: string, filter: TicketFilter, skip: number, limit: number): Promise<TicketWithRelations[]> {
    const { clause, params } = this.buildWhere(userId, filter);
    const rows = await query<Ticket>(
      `SELECT * FROM "tickets"
       ${clause}
       ORDER BY "createdAt" DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, skip],
    );
    return this.attachRelations(rows);
  }

  async count(userId: string, filter: TicketFilter): Promise<number> {
    const { clause, params } = this.buildWhere(userId, filter);
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM "tickets" ${clause}`, params);
    return Number(row?.count ?? 0);
  }

  async findById(userId: string, id: string): Promise<TicketWithRelations | null> {
    const ticket = await queryOne<Ticket>(`SELECT * FROM "tickets" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
    if (!ticket) return null;
    const [withRelations] = await this.attachRelations([ticket]);
    return withRelations!;
  }

  async update(userId: string, id: string, input: TicketUpdateData): Promise<TicketWithRelations> {
    const tagIds = input.tags ? await resolveTagIds(userId, input.tags) : undefined;

    const sets: string[] = [];
    const params: unknown[] = [];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`"${column}" = $${params.length}`);
    };

    if (input.title !== undefined) set('title', input.title);
    if (input.problem !== undefined) set('problem', input.problem);
    if (input.resolution !== undefined) set('resolution', input.resolution);
    if (input.status !== undefined) set('status', input.status);
    if (input.difficulty !== undefined) set('difficulty', input.difficulty);
    if (input.timeSpentMinutes !== undefined) set('timeSpentMinutes', input.timeSpentMinutes);
    // resolvedAt is always either "now" or "null" (computed by the service),
    // never an arbitrary caller date — a SQL literal sidesteps Date param
    // serialization entirely instead of needing toTimestampParam.
    if (input.resolvedAt !== undefined) {
      sets.push(input.resolvedAt === null ? `"resolvedAt" = NULL` : `"resolvedAt" = NOW()`);
    }
    sets.push(`"updatedAt" = NOW()`);

    params.push(id, userId);
    const ticket = await queryOne<Ticket>(
      `UPDATE "tickets" SET ${sets.join(', ')} WHERE "id" = $${params.length - 1} AND "userId" = $${params.length} RETURNING *`,
      params,
    );
    if (!ticket) throw new Error(`Ticket ${id} not found`);

    if (tagIds) {
      await this.setTags(id, tagIds);
    }

    const [withRelations] = await this.attachRelations([ticket]);
    return withRelations!;
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "tickets" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  /** pg_trgm title similarity search — returns ids ranked by similarity, highest first, scoped to this user's own tickets. */
  async findSimilarByTitle(userId: string, title: string, limit: number, excludeId?: string): Promise<SimilarTicketRow[]> {
    const params: unknown[] = [title, userId];
    let excludeClause = '';
    if (excludeId) {
      params.push(excludeId);
      excludeClause = `AND "id" != $${params.length}`;
    }
    params.push(limit);

    return query<SimilarTicketRow>(
      `SELECT "id", similarity("title", $1) AS sim
       FROM "tickets"
       WHERE similarity("title", $1) > ${SIMILARITY_THRESHOLD}
         AND "userId" = $2
         ${excludeClause}
       ORDER BY sim DESC
       LIMIT $${params.length}`,
      params,
    );
  }

  async findByIds(userId: string, ids: string[]): Promise<TicketWithRelations[]> {
    if (ids.length === 0) return [];
    const rows = await query<Ticket>(`SELECT * FROM "tickets" WHERE "id" = ANY($1) AND "userId" = $2`, [ids, userId]);
    return this.attachRelations(rows);
  }

  /** Replaces every tag on a ticket with exactly `tagIds`. */
  private async setTags(ticketId: string, tagIds: string[]): Promise<void> {
    await query(`DELETE FROM "_TagToTicket" WHERE "B" = $1`, [ticketId]);
    for (const tagId of tagIds) {
      await query(`INSERT INTO "_TagToTicket" ("A", "B") VALUES ($1, $2) ON CONFLICT ("A", "B") DO NOTHING`, [
        tagId,
        ticketId,
      ]);
    }
  }

  /** Batch-fetches tags + faq for a set of tickets in two extra queries, regardless of how many tickets. */
  private async attachRelations(tickets: Ticket[]): Promise<TicketWithRelations[]> {
    if (tickets.length === 0) return [];
    const ids = tickets.map((ticket) => ticket.id);

    const tagRows = await query<Tag & { ticketId: string }>(
      `SELECT tag.*, tt."B" AS "ticketId"
       FROM "_TagToTicket" tt
       JOIN "tags" tag ON tag."id" = tt."A"
       WHERE tt."B" = ANY($1)`,
      [ids],
    );
    const faqRows = await query<Faq>(`SELECT * FROM "faqs" WHERE "ticketId" = ANY($1)`, [ids]);

    const tagsByTicket = new Map<string, Tag[]>();
    for (const { ticketId, ...tag } of tagRows) {
      const list = tagsByTicket.get(ticketId) ?? [];
      list.push(tag);
      tagsByTicket.set(ticketId, list);
    }
    const faqByTicket = new Map(faqRows.map((faq) => [faq.ticketId, faq]));

    return tickets.map((ticket) => ({
      ...ticket,
      tags: tagsByTicket.get(ticket.id) ?? [],
      faq: faqByTicket.get(ticket.id) ?? null,
    }));
  }

  private buildWhere(userId: string, filter: TicketFilter): WhereClause {
    const conditions: string[] = [`"userId" = $1`];
    const params: unknown[] = [userId];

    if (filter.tag) {
      params.push(filter.tag.toLowerCase());
      conditions.push(
        `"id" IN (SELECT tt."B" FROM "_TagToTicket" tt JOIN "tags" tag ON tag."id" = tt."A" WHERE tag."name" = $${params.length})`,
      );
    }
    if (filter.difficulty) {
      params.push(filter.difficulty);
      conditions.push(`"difficulty" = $${params.length}`);
    }
    if (filter.status) {
      params.push(filter.status);
      conditions.push(`"status" = $${params.length}`);
    }

    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params,
    };
  }
}

export const ticketRepository = new TicketRepository();
