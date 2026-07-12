import { requestItem, requestList, requestVoid } from '../request';
import type { ListResult } from '@/types/common';
import type { CreateTaskInput, DueTasksQuery, ListTasksQuery, Task, UpdateTaskInput } from '@/types/task';

export const tasksApi = {
  list(query: ListTasksQuery): Promise<ListResult<Task>> {
    return requestList<Task>({ url: '/tasks', method: 'GET', params: query });
  },

  listDue(query: DueTasksQuery): Promise<ListResult<Task>> {
    return requestList<Task>({ url: '/tasks/due', method: 'GET', params: query });
  },

  getById(id: string): Promise<Task> {
    return requestItem<Task>({ url: `/tasks/${id}`, method: 'GET' });
  },

  create(input: CreateTaskInput): Promise<Task> {
    return requestItem<Task>({ url: '/tasks', method: 'POST', data: input });
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return requestItem<Task>({ url: `/tasks/${id}`, method: 'PATCH', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/tasks/${id}`, method: 'DELETE' });
  },
};
