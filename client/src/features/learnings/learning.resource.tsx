import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { TagList } from '@/components/ui/TagList';
import type { TableColumn } from '@/components/ui/Table';
import type { ResourceConfig } from '@/components/resource/types';
import { DOMAIN_SUGGESTIONS, getDomainTone } from '@/config/domains';
import { formatDate } from '@/lib/utils/date';
import { useDomainSearch } from '@/hooks/queries/useLearnings';
import type { CreateLearningInput, Learning, UpdateLearningInput } from '@/types/learning';

const columns: TableColumn<Learning>[] = [
  {
    key: 'title',
    header: 'Learning',
    className: 'max-w-64',
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-primary">{row.title}</p>
        {row.source ? <p className="truncate text-xs text-ink-muted">{row.source}</p> : null}
      </div>
    ),
  },
  {
    key: 'domain',
    header: 'Domain',
    render: (row) => <Badge tone={getDomainTone(row.domain)}>{row.domain}</Badge>,
  },
  {
    key: 'confidence',
    header: 'Confidence',
    render: (row) => <RatingStars value={row.confidence} />,
  },
  {
    key: 'tags',
    header: 'Tags',
    render: (row) => <TagList tags={row.tags.map((tag) => tag.name)} />,
  },
  {
    key: 'createdAt',
    header: 'Logged',
    className: 'tabular-nums',
    render: (row) => formatDate(row.createdAt),
  },
];

export const learningResourceConfig: ResourceConfig<Learning, CreateLearningInput, UpdateLearningInput> = {
  key: 'learnings',
  labels: { singular: 'Learning', plural: 'Learnings' },
  columns,
  filters: [
    { name: 'tag', type: 'search', placeholder: 'Filter by tag…' },
    { name: 'domain', type: 'search', placeholder: 'Filter by domain…' },
  ],
  formFields: [
    { name: 'title', label: 'What did you learn', type: 'text', required: true },
    {
      name: 'domain',
      label: 'Domain',
      type: 'domain',
      required: true,
      placeholder: 'Technology, Language, Music…',
      suggestions: [...DOMAIN_SUGGESTIONS],
      hint: 'Not just tech — anything you learn in your own time counts.',
    },
    { name: 'source', label: 'Source', type: 'text', placeholder: 'Course, doc, colleague…' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'confidence', label: 'Confidence (1–5)', type: 'rating', required: true },
    { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'e.g. kubernetes, spanish, guitar' },
  ],
  emptyValues: { title: '', domain: 'Technology', source: '', notes: '', confidence: 3, tags: [] },
  toFormValues: (learning) => ({
    title: learning.title,
    domain: learning.domain,
    source: learning.source ?? '',
    notes: learning.notes ?? '',
    confidence: learning.confidence,
    tags: learning.tags.map((tag) => tag.name),
  }),
  toCreateInput: (values) => ({
    title: values.title as string,
    domain: values.domain as string,
    source: (values.source as string) || undefined,
    notes: (values.notes as string) || undefined,
    confidence: values.confidence as number,
    tags: (values.tags as string[]) ?? [],
  }),
  toUpdateInput: (values) => ({
    title: values.title as string,
    domain: values.domain as string,
    source: (values.source as string) || undefined,
    notes: (values.notes as string) || undefined,
    confidence: values.confidence as number,
    tags: (values.tags as string[]) ?? [],
  }),
  useCreateDefaults: () => {
    const { data } = useDomainSearch({ limit: 1 });
    return { domain: data?.[0]?.domain };
  },
};
