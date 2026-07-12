import type { Tag } from './common';
import type { Faq } from './faq';

export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
  id: string;
  title: string;
  problem: string;
  resolution: string | null;
  status: TicketStatus;
  difficulty: Difficulty;
  timeSpentMinutes: number;
  tags: Tag[];
  faq: Faq | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  title: string;
  problem: string;
  resolution?: string;
  status: TicketStatus;
  difficulty: Difficulty;
  timeSpentMinutes: number;
  tags: string[];
  generateFaq: boolean;
}

export type UpdateTicketInput = Partial<Omit<CreateTicketInput, 'generateFaq'>>;

export interface TicketListQuery {
  page?: number;
  limit?: number;
  tag?: string;
  difficulty?: Difficulty;
  status?: TicketStatus;
}

export interface SimilarTicket {
  ticket: Ticket;
  similarity: number;
}

export interface SimilarTicketsQuery {
  title: string;
  limit?: number;
  excludeId?: string;
}
