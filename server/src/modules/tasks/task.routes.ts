import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as taskController from './task.controller';
import {
  createTaskSchema,
  dueTasksQuerySchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from './task.validation';

export const taskRoutes = Router();

taskRoutes.post('/', validate({ body: createTaskSchema }), taskController.createTask);
taskRoutes.get('/', validate({ query: listTasksQuerySchema }), taskController.listTasks);

// Must be registered before '/:id' so it isn't swallowed by the id route.
taskRoutes.get('/due', validate({ query: dueTasksQuerySchema }), taskController.listDueTasks);

taskRoutes.get('/:id', validate({ params: taskIdParamSchema }), taskController.getTask);
taskRoutes.patch(
  '/:id',
  validate({ params: taskIdParamSchema, body: updateTaskSchema }),
  taskController.updateTask,
);
taskRoutes.delete('/:id', validate({ params: taskIdParamSchema }), taskController.deleteTask);
