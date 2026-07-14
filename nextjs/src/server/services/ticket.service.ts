import type { ActivityType, TicketStatus } from '../common/enums';
import type { TicketActivity } from '../common/types/models';
import { BadRequestError, NotFoundError } from '../common/errors';
import { buildPaginationMeta, toSkip } from '../http/pagination';
import type { PaginationMeta } from '../http/response';
import { faqService } from './faq.service';
import { ticketActivityRepository } from '../repositories/ticket-activity.repository';
import { ticketRepository } from '../repositories/ticket.repository';
import type { TicketWithRelations } from '../repositories/ticket.types';
import type { CreateTicketInput, ListTicketsQuery, UpdateTicketInput } from '../validation/ticket.validation';

export interface SimilarTicket {
  ticket: TicketWithRelations;
  similarity: number;
}

function statusLabel(status: TicketStatus): string {
  return status
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}

class TicketService {
  async createTicket(userId: string, input: CreateTicketInput): Promise<TicketWithRelations> {
    const { generateFaq, ...ticketData } = input;
    const ticket = await ticketRepository.create(userId, ticketData);
    await ticketActivityRepository.create(userId, ticket.id, 'CREATED', 'Ticket created');

    if (generateFaq) {
      await faqService.generateFromTicket(userId, ticket.id);
      const withFaq = await ticketRepository.findById(userId, ticket.id);
      if (withFaq) return withFaq;
    }

    return ticket;
  }

  async listTickets(
    userId: string,
    query: ListTicketsQuery,
  ): Promise<{ tickets: TicketWithRelations[]; meta: PaginationMeta }> {
    const filter = { tag: query.tag, difficulty: query.difficulty, status: query.status };
    const pagination = { page: query.page, limit: query.limit };

    const [tickets, total] = await Promise.all([
      ticketRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      ticketRepository.count(userId, filter),
    ]);

    return { tickets, meta: buildPaginationMeta(total, pagination) };
  }

  async getTicketById(userId: string, id: string): Promise<TicketWithRelations> {
    const ticket = await ticketRepository.findById(userId, id);
    if (!ticket) throw new NotFoundError(`Ticket ${id} not found`);
    return ticket;
  }

  async updateTicket(userId: string, id: string, input: UpdateTicketInput): Promise<TicketWithRelations> {
    const existing = await this.getTicketById(userId, id);
    const nextStatus = input.status;
    const statusChanged = nextStatus !== undefined && nextStatus !== existing.status;

    if (nextStatus === 'RESOLVED') {
      const resolutionText = input.resolution ?? existing.resolution;
      if (!resolutionText?.trim()) {
        throw new BadRequestError('Add a resolution before marking this ticket resolved');
      }
    }

    const resolvedAt = statusChanged ? (nextStatus === 'RESOLVED' ? new Date() : null) : undefined;

    const updated = await ticketRepository.update(userId, id, { ...input, resolvedAt });

    if (statusChanged) {
      await ticketActivityRepository.create(
        userId,
        id,
        'STATUS_CHANGE',
        `Status changed from ${statusLabel(existing.status)} to ${statusLabel(nextStatus)}`,
      );
    }

    return updated;
  }

  async deleteTicket(userId: string, id: string): Promise<void> {
    await this.getTicketById(userId, id);
    await ticketRepository.delete(userId, id);
  }

  async findSimilarTickets(userId: string, title: string, limit: number, excludeId?: string): Promise<SimilarTicket[]> {
    const ranked = await ticketRepository.findSimilarByTitle(userId, title, limit, excludeId);
    if (ranked.length === 0) return [];

    const tickets = await ticketRepository.findByIds(userId, ranked.map((row) => row.id));
    const ticketsById = new Map(tickets.map((ticket) => [ticket.id, ticket]));

    return ranked
      .map((row) => {
        const ticket = ticketsById.get(row.id);
        return ticket ? { ticket, similarity: row.sim } : null;
      })
      .filter((entry): entry is SimilarTicket => entry !== null);
  }

  async addActivity(userId: string, ticketId: string, type: ActivityType, note: string): Promise<TicketActivity> {
    await this.getTicketById(userId, ticketId);
    return ticketActivityRepository.create(userId, ticketId, type, note);
  }

  async listActivities(userId: string, ticketId: string): Promise<TicketActivity[]> {
    await this.getTicketById(userId, ticketId);
    return ticketActivityRepository.findByTicketId(userId, ticketId);
  }

  async deleteActivity(userId: string, ticketId: string, activityId: string): Promise<void> {
    const activity = await ticketActivityRepository.findById(userId, activityId);
    if (!activity || activity.ticketId !== ticketId) {
      throw new NotFoundError(`Activity ${activityId} not found on ticket ${ticketId}`);
    }
    await ticketActivityRepository.delete(userId, activityId);
  }
}

export const ticketService = new TicketService();
