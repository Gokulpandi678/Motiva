import type { Task } from '../common/types/models';
import { NotFoundError } from '../common/errors';
import type { PaginationMeta } from '../http/response';
import { buildPaginationMeta, toSkip } from '../http/pagination';
import { taskRepository } from '../repositories/task.repository';
import type { CreateTaskInput, DueTasksQuery, ListTasksQuery, UpdateTaskInput } from '../validation/task.validation';

class TaskService {
  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    return taskRepository.create(userId, input);
  }

  async listTasks(userId: string, query: ListTasksQuery): Promise<{ tasks: Task[]; meta: PaginationMeta }> {
    const filter = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.ticketId ? { ticketId: query.ticketId } : {}),
      ...(query.standaloneOnly ? { ticketId: null } : {}),
    };
    const pagination = { page: query.page, limit: query.limit };

    const [tasks, total] = await Promise.all([
      taskRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      taskRepository.count(userId, filter),
    ]);

    return { tasks, meta: buildPaginationMeta(total, pagination) };
  }

  async listDueTasks(userId: string, query: DueTasksQuery): Promise<{ tasks: Task[]; meta: PaginationMeta }> {
    const now = new Date();
    const pagination = { page: query.page, limit: query.limit };

    const [tasks, total] = await Promise.all([
      taskRepository.findDue(userId, now, toSkip(pagination), pagination.limit),
      taskRepository.countDue(userId, now),
    ]);

    return { tasks, meta: buildPaginationMeta(total, pagination) };
  }

  async getTaskById(userId: string, id: string): Promise<Task> {
    const task = await taskRepository.findById(userId, id);
    if (!task) throw new NotFoundError(`Task ${id} not found`);
    return task;
  }

  async updateTask(userId: string, id: string, input: UpdateTaskInput): Promise<Task> {
    await this.getTaskById(userId, id);
    return taskRepository.update(userId, id, input);
  }

  async deleteTask(userId: string, id: string): Promise<void> {
    await this.getTaskById(userId, id);
    await taskRepository.delete(userId, id);
  }
}

export const taskService = new TaskService();
