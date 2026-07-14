import { requestItem, requestList, requestVoid } from '../request';
import type { ListResult } from '@/types/common';
import type { Faq } from '@/types/faq';
import type {
  CreateTicketInput,
  SimilarTicket,
  SimilarTicketsQuery,
  Ticket,
  TicketListQuery,
  UpdateTicketInput,
} from '@/types/ticket';
import type { CreateActivityInput, TicketActivity } from '@/types/ticketActivity';

export const ticketsApi = {
  list(query: TicketListQuery): Promise<ListResult<Ticket>> {
    return requestList<Ticket>({ url: '/tickets', method: 'GET', params: query });
  },

  getById(id: string): Promise<Ticket> {
    return requestItem<Ticket>({ url: `/tickets/${id}`, method: 'GET' });
  },

  create(input: CreateTicketInput): Promise<Ticket> {
    return requestItem<Ticket>({ url: '/tickets', method: 'POST', data: input });
  },

  update(id: string, input: UpdateTicketInput): Promise<Ticket> {
    return requestItem<Ticket>({ url: `/tickets/${id}`, method: 'PATCH', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/tickets/${id}`, method: 'DELETE' });
  },

  generateFaq(id: string): Promise<Faq> {
    return requestItem<Faq>({ url: `/tickets/${id}/faq`, method: 'POST' });
  },

  findSimilar(query: SimilarTicketsQuery): Promise<SimilarTicket[]> {
    return requestItem<SimilarTicket[]>({ url: '/tickets/similar', method: 'GET', params: query });
  },

  listActivities(ticketId: string): Promise<TicketActivity[]> {
    return requestItem<TicketActivity[]>({ url: `/tickets/${ticketId}/activities`, method: 'GET' });
  },

  addActivity(ticketId: string, input: CreateActivityInput): Promise<TicketActivity> {
    return requestItem<TicketActivity>({ url: `/tickets/${ticketId}/activities`, method: 'POST', data: input });
  },

  removeActivity(ticketId: string, activityId: string): Promise<void> {
    return requestVoid({ url: `/tickets/${ticketId}/activities/${activityId}`, method: 'DELETE' });
  },
};
