import type { ResourceConfig } from '@/components/resource/types';
import { DIFFICULTY_META, TICKET_STATUS_META } from '@/config/enums';
import { DIFFICULTIES, TICKET_STATUSES, type CreateTicketInput, type Ticket, type UpdateTicketInput } from '@/types/ticket';
import { ticketColumns } from './ticket.columns';
import { ticketFormFields } from './ticket.fields';

export const ticketResourceConfig: ResourceConfig<Ticket, CreateTicketInput, UpdateTicketInput> = {
  key: 'tickets',
  labels: { singular: 'Ticket', plural: 'Tickets' },
  columns: ticketColumns,
  filters: [
    { name: 'tag', type: 'search', placeholder: 'Filter by tag…' },
    {
      name: 'status',
      type: 'select',
      placeholder: 'All statuses',
      options: TICKET_STATUSES.map((status) => ({ value: status, label: TICKET_STATUS_META[status].label })),
    },
    {
      name: 'difficulty',
      type: 'select',
      placeholder: 'All difficulties',
      options: DIFFICULTIES.map((difficulty) => ({ value: difficulty, label: DIFFICULTY_META[difficulty].label })),
    },
  ],
  formFields: ticketFormFields,
  emptyValues: {
    title: '',
    problem: '',
    status: 'OPEN',
    resolution: '',
    difficulty: 'MEDIUM',
    timeSpentMinutes: 0,
    tags: [],
    generateFaq: false,
  },
  toFormValues: (ticket) => ({
    title: ticket.title,
    problem: ticket.problem,
    status: ticket.status,
    resolution: ticket.resolution ?? '',
    difficulty: ticket.difficulty,
    timeSpentMinutes: ticket.timeSpentMinutes,
    tags: ticket.tags.map((tag) => tag.name),
  }),
  toCreateInput: (values) => ({
    title: values.title as string,
    problem: values.problem as string,
    status: values.status as CreateTicketInput['status'],
    resolution: (values.resolution as string) || undefined,
    difficulty: values.difficulty as CreateTicketInput['difficulty'],
    timeSpentMinutes: values.timeSpentMinutes as number,
    tags: (values.tags as string[]) ?? [],
    generateFaq: Boolean(values.generateFaq),
  }),
  toUpdateInput: (values) => ({
    title: values.title as string,
    problem: values.problem as string,
    status: values.status as UpdateTicketInput['status'],
    resolution: (values.resolution as string) || undefined,
    difficulty: values.difficulty as UpdateTicketInput['difficulty'],
    timeSpentMinutes: values.timeSpentMinutes as number,
    tags: (values.tags as string[]) ?? [],
  }),
};
