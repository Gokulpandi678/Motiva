import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { dueTasksQuerySchema } from '@/server/validation/task.validation';
import { taskService } from '@/server/services/task.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(dueTasksQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { tasks, meta } = await taskService.listDueTasks(user.id, query);
  return apiSuccess(tasks, { meta });
});
