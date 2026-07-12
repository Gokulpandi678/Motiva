import { z } from 'zod';
import { ActivityType } from '../../common/enums';

export const createActivitySchema = z.object({
  type: z.nativeEnum(ActivityType).default(ActivityType.NOTE),
  note: z.string().trim().min(1),
});
export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const activityIdParamSchema = z.object({
  id: z.string().uuid(),
  activityId: z.string().uuid(),
});
