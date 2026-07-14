import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { createTaskSchema, listTasksQuerySchema } from '@/server/validation/task.validation';
import { taskService } from '@/server/services/task.service';

export const runtime = 'nodejs';

export const POST = withAuth(async (request, { user }) => {
  const input = parseWith(createTaskSchema, await request.json());
  const task = await taskService.createTask(user.id, input);
  return apiSuccess(task, { status: 201 });
});

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(listTasksQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { tasks, meta } = await taskService.listTasks(user.id, query);
  return apiSuccess(tasks, { meta });
});
