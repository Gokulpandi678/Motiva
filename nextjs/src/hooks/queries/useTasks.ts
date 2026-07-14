import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/endpoints/tasks';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import { createTaskAction, updateTaskAction, deleteTaskAction } from '@/server/actions/task.actions';
import type { CreateTaskInput, DueTasksQuery, ListTasksQuery, Task, UpdateTaskInput } from '@/types/task';
import { createCrudQueries } from './createCrudQueries';

function accessToken(): string {
  return tokenStorage.getAccessToken() ?? '';
}

// create/update/remove now call the Server Action directly; list/getById
// still read through the REST endpoint. The REST routes stay live for
// Postman/external use — additive, not a replacement. This is also what
// TicketTaskList's inline "add task" / "toggle done" (via this same
// taskQueries.useCreate/useUpdate) end up calling.
export const taskQueries = createCrudQueries<Task, ListTasksQuery, CreateTaskInput, UpdateTaskInput>({
  resourceKey: 'tasks',
  list: tasksApi.list,
  getById: tasksApi.getById,
  create: (input) => createTaskAction(accessToken(), input).then(unwrapAction),
  update: (id, input) => updateTaskAction(accessToken(), id, input).then(unwrapAction),
  remove: (id) => deleteTaskAction(accessToken(), id).then(unwrapAction),
});

export function useDueTasks(query: DueTasksQuery) {
  return useQuery({
    queryKey: ['tasks', 'due', query],
    queryFn: () => tasksApi.listDue(query),
  });
}
