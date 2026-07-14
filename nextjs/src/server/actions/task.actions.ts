'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { taskService } from '../services/task.service';
import { parseWith } from '../http/validate';
import { createTaskSchema, taskIdParamSchema, updateTaskSchema } from '../validation/task.validation';

export async function createTaskAction(accessToken: string, input: unknown) {
  return runAction('createTask', async () => {
    const user = await requireAuthFromToken(accessToken);
    const validInput = parseWith(createTaskSchema, input);
    return taskService.createTask(user.id, validInput);
  });
}

export async function updateTaskAction(accessToken: string, id: string, input: unknown) {
  return runAction('updateTask', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(taskIdParamSchema, { id });
    const validInput = parseWith(updateTaskSchema, input);
    return taskService.updateTask(user.id, validId, validInput);
  });
}

export async function deleteTaskAction(accessToken: string, id: string) {
  return runAction('deleteTask', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(taskIdParamSchema, { id });
    await taskService.deleteTask(user.id, validId);
  });
}
