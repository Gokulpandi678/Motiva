import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/lib/api/endpoints/tickets';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import {
  createTicketAction,
  updateTicketAction,
  deleteTicketAction,
  generateFaqAction,
  addActivityAction,
  removeActivityAction,
} from '@/server/actions/ticket.actions';
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

function accessToken(): string {
  return tokenStorage.getAccessToken() ?? '';
}

// list/getById still read through the REST endpoints (ticketsApi); create/
// update/remove now call the Server Action directly. The REST routes stay
// live for Postman/external use — additive, not a replacement.
export const ticketQueries = createCrudQueries<Ticket, TicketListQuery, CreateTicketInput, UpdateTicketInput>({
  resourceKey: 'tickets',
  list: ticketsApi.list,
  getById: ticketsApi.getById,
  create: (input) => createTicketAction(accessToken(), input).then(unwrapAction),
  update: (id, input) => updateTicketAction(accessToken(), id, input).then(unwrapAction),
  remove: (id) => deleteTicketAction(accessToken(), id).then(unwrapAction),
});

export function useGenerateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => generateFaqAction(accessToken(), ticketId).then(unwrapAction),
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
      addActivityAction(accessToken(), ticketId, input).then(unwrapAction),
    onSuccess: (_activity, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'activities', ticketId] });
    },
  });
}

export function useRemoveActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, activityId }: { ticketId: string; activityId: string }) =>
      removeActivityAction(accessToken(), ticketId, activityId).then(unwrapAction),
    onSuccess: (_void_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'activities', ticketId] });
    },
  });
}
