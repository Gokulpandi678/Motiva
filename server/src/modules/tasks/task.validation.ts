import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../../common/enums';

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(1).optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  dueDate: z.coerce.date().optional(),
  ticketId: z.string().uuid().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  ticketId: z.string().uuid().optional(),
  /** When true, only tasks with no ticketId — the standalone to-do list view. */
  standaloneOnly: z.coerce.boolean().optional(),
});
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

export const dueTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type DueTasksQuery = z.infer<typeof dueTasksQuerySchema>;

export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});
