import type { TableColumn } from '@/components/ui/Table';
import type { ResourceConfig } from '@/components/resource/types';
import { formatDate } from '@/lib/utils/date';
import type { Faq, UpdateFaqInput } from '@/types/faq';

const columns: TableColumn<Faq>[] = [
  {
    key: 'question',
    header: 'Question',
    className: 'max-w-80',
    render: (row) => <p className="truncate font-medium text-ink-primary">{row.question}</p>,
  },
  {
    key: 'answer',
    header: 'Answer',
    className: 'max-w-96',
    render: (row) => <p className="truncate text-ink-secondary">{row.answer}</p>,
  },
  {
    key: 'createdAt',
    header: 'Added',
    className: 'tabular-nums',
    render: (row) => formatDate(row.createdAt),
  },
];

export const faqResourceConfig: ResourceConfig<Faq, never, UpdateFaqInput> = {
  key: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  columns,
  filters: [{ name: 'search', type: 'search', placeholder: 'Search questions and answers…' }],
  formFields: [
    { name: 'question', label: 'Question', type: 'textarea', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
  ],
  canCreate: false,
  emptyValues: { question: '', answer: '' },
  toFormValues: (faq) => ({ question: faq.question, answer: faq.answer }),
  toCreateInput: () => {
    throw new Error('FAQs are generated from tickets, not created directly');
  },
  toUpdateInput: (values) => ({
    question: values.question as string,
    answer: values.answer as string,
  }),
};
