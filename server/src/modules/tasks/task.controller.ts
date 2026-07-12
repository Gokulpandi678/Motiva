import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { taskService } from './task.service';
import type { CreateTaskInput, DueTasksQuery, ListTasksQuery, UpdateTaskInput } from './task.validation';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user!.id, req.body as CreateTaskInput);
  sendSuccess(res, task, 201);
});

export const listTasks = asyncHandler(async (req, res) => {
  const { tasks, meta } = await taskService.listTasks(req.user!.id, req.query as unknown as ListTasksQuery);
  sendSuccess(res, tasks, 200, meta);
});

export const listDueTasks = asyncHandler(async (req, res) => {
  const { tasks, meta } = await taskService.listDueTasks(req.user!.id, req.query as unknown as DueTasksQuery);
  sendSuccess(res, tasks, 200, meta);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user!.id, req.params.id as string);
  sendSuccess(res, task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user!.id, req.params.id as string, req.body as UpdateTaskInput);
  sendSuccess(res, task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user!.id, req.params.id as string);
  res.status(204).send();
});
