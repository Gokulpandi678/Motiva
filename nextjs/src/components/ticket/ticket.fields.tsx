import type { FieldConfig } from '@/components/resource/types';
import { DIFFICULTY_META, TICKET_STATUS_META } from '@/config/enums';
import { DIFFICULTIES, TICKET_STATUSES } from '@/types/ticket';
import { SimilarTicketNudge } from './SimilarTicketNudge';

const TIME_SPENT_PRESETS = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '2h', value: 120 },
];

export const ticketFormFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'What was the ticket?',
    renderAfter: ({ values, setValue }) =>
      values.title ? <SimilarTicketNudge values={values} setValue={setValue} /> : null,
  },
  { name: 'problem', label: 'What was wrong', type: 'textarea', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: TICKET_STATUSES.map((status) => ({ value: status, label: TICKET_STATUS_META[status].label })),
  },
  {
    name: 'resolution',
    label: 'What fixed it',
    type: 'textarea',
    hint: 'Required once the status is Resolved.',
  },
  {
    name: 'difficulty',
    label: 'Difficulty',
    type: 'segmented',
    required: true,
    options: DIFFICULTIES.map((difficulty) => ({
      value: difficulty,
      label: DIFFICULTY_META[difficulty].label,
      tone: DIFFICULTY_META[difficulty].tone,
    })),
  },
  {
    name: 'timeSpentMinutes',
    label: 'Time spent (minutes)',
    type: 'quick-number',
    required: true,
    min: 0,
    presets: TIME_SPENT_PRESETS,
  },
  { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'e.g. redis, nodejs' },
  {
    name: 'generateFaq',
    label: 'Generate a FAQ entry from this ticket',
    type: 'boolean',
    createOnly: true,
    hint: 'Only works if status is Resolved and a resolution is filled in.',
  },
];
