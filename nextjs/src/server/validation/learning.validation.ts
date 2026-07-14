import { z } from 'zod';

export const createLearningSchema = z.object({
  title: z.string().trim().min(3).max(200),
  domain: z.string().trim().min(1).max(100),
  source: z.string().trim().min(1).max(200).optional(),
  notes: z.string().trim().min(1).optional(),
  confidence: z.number().int().min(1).max(5),
  tags: z.array(z.string().trim().min(1)).default([]),
});
export type CreateLearningInput = z.infer<typeof createLearningSchema>;

export const updateLearningSchema = createLearningSchema.partial();
export type UpdateLearningInput = z.infer<typeof updateLearningSchema>;

export const listLearningsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  tag: z.string().trim().min(1).optional(),
  domain: z.string().trim().min(1).optional(),
});
export type ListLearningsQuery = z.infer<typeof listLearningsQuerySchema>;

export const topicsQuerySchema = z.object({
  domain: z.string().trim().min(1).optional(),
});
export type TopicsQuery = z.infer<typeof topicsQuerySchema>;

export const topicParamSchema = z.object({
  tag: z.string().trim().min(1),
});

export const lowConfidenceQuerySchema = z.object({
  threshold: z.coerce.number().int().min(1).max(5).default(3),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type LowConfidenceQuery = z.infer<typeof lowConfidenceQuerySchema>;

export const learningIdParamSchema = z.object({
  id: z.string().uuid(),
});
