import { AlertTriangle, CircleSlash } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelative } from '@/lib/utils/date';
import type { SkillGrowthEntry } from '@/types/skill';

interface BlindSpotListProps {
  entries: SkillGrowthEntry[];
}

export function BlindSpotList({ entries }: BlindSpotListProps) {
  if (entries.length === 0) {
    return <EmptyState title="No blind spots" description="Every tag you've used has been touched recently." />;
  }

  return (
    <ul className="divide-y divide-border-hairline">
      {entries.map((entry) => (
        <li key={entry.tag} className="flex items-center justify-between gap-3 py-2.5">
          <span className="text-sm font-medium text-ink-primary">{entry.tag}</span>
          {entry.lastTouchedAt ? (
            <Badge tone="warning" icon={<AlertTriangle className="size-3" />}>
              Stale · {formatRelative(entry.lastTouchedAt)}
            </Badge>
          ) : (
            <Badge tone="critical" icon={<CircleSlash className="size-3" />}>
              Never touched
            </Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
