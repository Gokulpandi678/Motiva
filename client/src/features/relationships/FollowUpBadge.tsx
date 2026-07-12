import { Badge } from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils/date';
import type { Relationship } from '@/types/relationship';

export function FollowUpBadge({ row }: { row: Relationship }) {
  if (!row.followUpDate) return <span className="text-ink-muted">—</span>;
  if (row.followUpDone) return <Badge tone="good">Done · {formatDate(row.followUpDate)}</Badge>;
  if (isOverdue(row.followUpDate)) return <Badge tone="critical">Overdue · {formatDate(row.followUpDate)}</Badge>;
  return <Badge tone="neutral">{formatDate(row.followUpDate)}</Badge>;
}
