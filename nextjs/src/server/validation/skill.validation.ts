import { z } from 'zod';

export const blindSpotsQuerySchema = z.object({
  days: z.coerce.number().int().positive().default(30),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type BlindSpotsQuery = z.infer<typeof blindSpotsQuerySchema>;
