import { z } from 'zod';
import { Difficulty, TicketStatus } from '../../common/enums';

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(200),
  problem: z.string().trim().min(1),
  resolution: z.string().trim().min(1).optional(),
  status: z.nativeEnum(TicketStatus).default(TicketStatus.OPEN),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  timeSpentMinutes: z.number().int().min(0).default(0),
  tags: z.array(z.string().trim().min(1)).default([]),
  generateFaq: z.boolean().default(false),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = createTicketSchema.omit({ generateFaq: true }).partial();
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const listTicketsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  tag: z.string().trim().min(1).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
});
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;

export const ticketIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const similarTicketsQuerySchema = z.object({
  title: z.string().trim().min(3),
  limit: z.coerce.number().int().positive().max(20).default(5),
  excludeId: z.string().uuid().optional(),
});
export type SimilarTicketsQuery = z.infer<typeof similarTicketsQuerySchema>;
