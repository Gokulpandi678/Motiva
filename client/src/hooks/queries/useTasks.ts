import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/endpoints/tasks';
import type { CreateTaskInput, DueTasksQuery, ListTasksQuery, Task, UpdateTaskInput } from '@/types/task';
import { createCrudQueries } from './createCrudQueries';

export const taskQueries = createCrudQueries<Task, ListTasksQuery, CreateTaskInput, UpdateTaskInput>({
  resourceKey: 'tasks',
  list: tasksApi.list,
  getById: tasksApi.getById,
  create: tasksApi.create,
  update: tasksApi.update,
  remove: tasksApi.remove,
});

export function useDueTasks(query: DueTasksQuery) {
  return useQuery({
    queryKey: ['tasks', 'due', query],
    queryFn: () => tasksApi.listDue(query),
  });
}
