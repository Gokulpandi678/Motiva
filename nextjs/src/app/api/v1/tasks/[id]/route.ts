import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { taskIdParamSchema, updateTaskSchema } from '@/server/validation/task.validation';
import { taskService } from '@/server/services/task.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(taskIdParamSchema, await params);
  const task = await taskService.getTaskById(user.id, id);
  return apiSuccess(task);
});

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(taskIdParamSchema, await params);
  const input = parseWith(updateTaskSchema, await request.json());
  const task = await taskService.updateTask(user.id, id, input);
  return apiSuccess(task);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(taskIdParamSchema, await params);
  await taskService.deleteTask(user.id, id);
  return new NextResponse(null, { status: 204 });
});
