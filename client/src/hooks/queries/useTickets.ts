import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/lib/api/endpoints/tickets';
import type {
  CreateTicketInput,
  SimilarTicketsQuery,
  Ticket,
  TicketListQuery,
  UpdateTicketInput,
} from '@/types/ticket';
import type { CreateActivityInput } from '@/types/ticketActivity';
import { createCrudQueries } from './createCrudQueries';
import { faqQueries } from './useFaqs';

export const ticketQueries = createCrudQueries<Ticket, TicketListQuery, CreateTicketInput, UpdateTicketInput>({
  resourceKey: 'tickets',
  list: ticketsApi.list,
  getById: ticketsApi.getById,
  create: ticketsApi.create,
  update: ticketsApi.update,
  remove: ticketsApi.remove,
});

export function useGenerateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => ticketsApi.generateFaq(ticketId),
    onSuccess: (_faq, ticketId) => {
      queryClient.invalidateQueries({ queryKey: ticketQueries.keys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketQueries.keys.all });
      queryClient.invalidateQueries({ queryKey: faqQueries.keys.all });
    },
  });
}

export function useSimilarTickets(query: SimilarTicketsQuery, enabled = true) {
  return useQuery({
    queryKey: ['tickets', 'similar', query],
    queryFn: () => ticketsApi.findSimilar(query),
    enabled: enabled && query.title.trim().length >= 3,
  });
}

export function useTicketActivities(ticketId: string | undefined) {
  return useQuery({
    queryKey: ['tickets', 'activities', ticketId],
    queryFn: () => ticketsApi.listActivities(ticketId as string),
    enabled: Boolean(ticketId),
  });
}

export function useAddActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: CreateActivityInput }) =>
      ticketsApi.addActivity(ticketId, input),
    onSuccess: (_activity, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'activities', ticketId] });
    },
  });
}

export function useRemoveActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, activityId }: { ticketId: string; activityId: string }) =>
      ticketsApi.removeActivity(ticketId, activityId),
    onSuccess: (_void_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'activities', ticketId] });
    },
  });
}
