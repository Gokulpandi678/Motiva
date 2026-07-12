import { randomUUID } from 'node:crypto';
import { query, queryOne, toTimestampParam } from '../../config/db';
import type { TaskPriority, TaskStatus } from '../../common/enums';
import type { Task } from '../../common/types/models';
import type { CreateTaskInput, UpdateTaskInput } from './task.validation';

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  /** `null` means "standalone only" (no linked ticket). */
  ticketId?: string | null;
}

interface WhereClause {
  clause: string;
  params: unknown[];
}

class TaskRepository {
  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const task = await queryOne<Task>(
      `INSERT INTO "tasks"
         ("id", "userId", "title", "description", "priority", "status", "dueDate", "ticketId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        randomUUID(),
        userId,
        input.title,
        input.description ?? null,
        input.priority,
        input.status,
        toTimestampParam(input.dueDate) ?? null,
        input.ticketId ?? null,
      ],
    );
    return task!;
  }

  async findMany(userId: string, filter: TaskFilter, skip: number, limit: number): Promise<Task[]> {
    const { clause, params } = this.buildWhere(userId, filter);
    return query<Task>(
      `SELECT * FROM "tasks"
       ${clause}
       ORDER BY "dueDate" ASC, "createdAt" DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, skip],
    );
  }

  async count(userId: string, filter: TaskFilter): Promise<number> {
    const { clause, params } = this.buildWhere(userId, filter);
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM "tasks" ${clause}`, params);
    return Number(row?.count ?? 0);
  }

  async findDue(userId: string, asOf: Date, skip: number, limit: number): Promise<Task[]> {
    return query<Task>(
      `SELECT * FROM "tasks"
       WHERE "userId" = $1 AND "status" != 'DONE' AND "dueDate" <= $2
       ORDER BY "dueDate" ASC
       LIMIT $3 OFFSET $4`,
      [userId, toTimestampParam(asOf), limit, skip],
    );
  }

  async countDue(userId: string, asOf: Date): Promise<number> {
    const row = await queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM "tasks" WHERE "userId" = $1 AND "status" != 'DONE' AND "dueDate" <= $2`,
      [userId, toTimestampParam(asOf)],
    );
    return Number(row?.count ?? 0);
  }

  async findById(userId: string, id: string): Promise<Task | null> {
    return queryOne<Task>(`SELECT * FROM "tasks" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  async update(userId: string, id: string, input: UpdateTaskInput): Promise<Task> {
    const sets: string[] = [];
    const params: unknown[] = [];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`"${column}" = $${params.length}`);
    };

    if (input.title !== undefined) set('title', input.title);
    if (input.description !== undefined) set('description', input.description);
    if (input.priority !== undefined) set('priority', input.priority);
    if (input.status !== undefined) set('status', input.status);
    if (input.dueDate !== undefined) set('dueDate', toTimestampParam(input.dueDate));
    if (input.ticketId !== undefined) set('ticketId', input.ticketId);
    sets.push(`"updatedAt" = NOW()`);

    params.push(id, userId);
    const task = await queryOne<Task>(
      `UPDATE "tasks" SET ${sets.join(', ')} WHERE "id" = $${params.length - 1} AND "userId" = $${params.length} RETURNING *`,
      params,
    );
    return task!;
  }

  async delete(userId: string, id: string): Promise<void> {
    await query(`DELETE FROM "tasks" WHERE "id" = $1 AND "userId" = $2`, [id, userId]);
  }

  private buildWhere(userId: string, filter: TaskFilter): WhereClause {
    const conditions: string[] = [`"userId" = $1`];
    const params: unknown[] = [userId];

    if (filter.status) {
      params.push(filter.status);
      conditions.push(`"status" = $${params.length}`);
    }
    if (filter.priority) {
      params.push(filter.priority);
      conditions.push(`"priority" = $${params.length}`);
    }
    if (filter.ticketId === null) {
      conditions.push(`"ticketId" IS NULL`);
    } else if (filter.ticketId !== undefined) {
      params.push(filter.ticketId);
      conditions.push(`"ticketId" = $${params.length}`);
    }

    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params,
    };
  }
}

export const taskRepository = new TaskRepository();
