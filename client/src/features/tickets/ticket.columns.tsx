import { Badge } from '@/components/ui/Badge';
import { TagList } from '@/components/ui/TagList';
import type { TableColumn } from '@/components/ui/Table';
import { DIFFICULTY_META, TICKET_STATUS_META } from '@/config/enums';
import { formatDate } from '@/lib/utils/date';
import { formatDuration } from '@/lib/utils/duration';
import type { Ticket } from '@/types/ticket';

export const ticketColumns: TableColumn<Ticket>[] = [
  {
    key: 'title',
    header: 'Ticket',
    className: 'max-w-64',
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-primary">{row.title}</p>
        <p className="truncate text-xs text-ink-muted">{row.problem}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge tone={TICKET_STATUS_META[row.status].tone}>{TICKET_STATUS_META[row.status].label}</Badge>,
  },
  {
    key: 'difficulty',
    header: 'Difficulty',
    render: (row) => <Badge tone={DIFFICULTY_META[row.difficulty].tone}>{DIFFICULTY_META[row.difficulty].label}</Badge>,
  },
  {
    key: 'tags',
    header: 'Tags',
    render: (row) => <TagList tags={row.tags.map((tag) => tag.name)} />,
  },
  {
    key: 'timeSpentMinutes',
    header: 'Time spent',
    className: 'tabular-nums',
    render: (row) => formatDuration(row.timeSpentMinutes),
  },
  {
    key: 'faq',
    header: 'FAQ',
    render: (row) => (row.faq ? <Badge tone="good">Generated</Badge> : <span className="text-ink-muted">—</span>),
  },
  {
    key: 'createdAt',
    header: 'Logged',
    className: 'tabular-nums',
    render: (row) => formatDate(row.createdAt),
  },
];
