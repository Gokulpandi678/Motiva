import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDomainTone } from '@/config/domains';
import { formatDate, formatRelative } from '@/lib/utils/date';
import { useTopicTimeline } from '@/hooks/queries/useLearnings';

interface TopicTimelineDrawerProps {
  tag: string | null;
  onClose: () => void;
}

export function TopicTimelineDrawer({ tag, onClose }: TopicTimelineDrawerProps) {
  const { data, isLoading } = useTopicTimeline(tag ?? undefined);

  return (
    <Drawer open={Boolean(tag)} onClose={onClose} title={tag ?? ''} description="Every log against this topic, newest first.">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !data || data.entries.length === 0 ? (
        <EmptyState title="No logs found" />
      ) : (
        <ol className="relative space-y-5 border-l border-border-hairline pl-5">
          {data.entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-surface bg-accent" />
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-ink-primary">{entry.title}</p>
                <Badge tone={getDomainTone(entry.domain)} className="shrink-0">
                  {entry.domain}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={entry.confidence} />
                <span className="text-xs text-ink-muted" title={formatDate(entry.createdAt)}>
                  {formatRelative(entry.createdAt)}
                </span>
              </div>
              {entry.notes ? <p className="mt-1.5 text-sm text-ink-secondary">{entry.notes}</p> : null}
              {entry.source ? <p className="mt-1 text-xs text-ink-muted">Source: {entry.source}</p> : null}
            </li>
          ))}
        </ol>
      )}
    </Drawer>
  );
}
