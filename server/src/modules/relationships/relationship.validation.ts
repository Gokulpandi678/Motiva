import { z } from 'zod';
import { InteractionType } from '../../common/enums';

export const createRelationshipSchema = z.object({
  personName: z.string().trim().min(1).max(200),
  interactionType: z.nativeEnum(InteractionType),
  context: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  followUpDate: z.coerce.date().optional(),
});
export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;

export const updateRelationshipSchema = createRelationshipSchema.partial().extend({
  followUpDone: z.boolean().optional(),
});
export type UpdateRelationshipInput = z.infer<typeof updateRelationshipSchema>;

export const listRelationshipsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  interactionType: z.nativeEnum(InteractionType).optional(),
});
export type ListRelationshipsQuery = z.infer<typeof listRelationshipsQuerySchema>;

export const dueFollowUpsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type DueFollowUpsQuery = z.infer<typeof dueFollowUpsQuerySchema>;

export const relationshipIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const searchPeopleQuerySchema = z.object({
  q: z.string().trim().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type SearchPeopleQuery = z.infer<typeof searchPeopleQuerySchema>;
