import { z } from 'zod';

export const updateFaqSchema = z.object({
  question: z.string().trim().min(1).optional(),
  answer: z.string().trim().min(1).optional(),
});
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;

export const listFaqsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().min(1).optional(),
});
export type ListFaqsQuery = z.infer<typeof listFaqsQuerySchema>;

export const faqIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const ticketIdParamSchema = z.object({
  id: z.string().uuid(),
});
