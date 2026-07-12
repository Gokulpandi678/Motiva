import { randomUUID } from 'node:crypto';
import { query, queryOne } from '../../config/db';
import type { ActivityType } from '../../common/enums';
import type { TicketActivity } from '../../common/types/models';

class TicketActivityRepository {
  async create(userId: string, ticketId: string, type: ActivityType, note: string): Promise<TicketActivity> {
    const activity = await queryOne<TicketActivity>(
      `INSERT INTO "ticket_activities" ("id", "userId", "ticketId", "type", "note", "createdAt")
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [randomUUID(), userId, ticketId, type, note],
    );
    return activity!;
  }

  async findByTicketId(userId: string, ticketId: string): Promise<TicketActivity[]> {
    return query<TicketActivity>(
      `SELECT * FROM "ticket_activities" WHERE "ticketId" = $1 AND "userId" = $2 ORDER BY "createdAt" DESC`,
      [ticketId, userId],
    );
  }

  async findById(userId: string, id: string): Promise<TicketActivity | null> {
    return queryOne<TicketActivity>(`SELECT * FROM "ticket_activities" WHERE "id" = $1 AND "userId" = $2`, [
      id,
      userId,
    ]);
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "ticket_activities" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }
}

export const ticketActivityRepository = new TicketActivityRepository();
