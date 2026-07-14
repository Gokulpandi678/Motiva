import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

interface ActivityListCardProps<T> {
  title: string;
  viewAllTo: string;
  isLoading: boolean;
  items: T[] | undefined;
  rowKey: (item: T) => string;
  renderPrimary: (item: T) => ReactNode;
  renderSecondary: (item: T) => ReactNode;
  renderBadge: (item: T) => ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  skeletonCount?: number;
}

export function ActivityListCard<T>({
  title,
  viewAllTo,
  isLoading,
  items,
  rowKey,
  renderPrimary,
  renderSecondary,
  renderBadge,
  emptyTitle,
  emptyDescription,
  skeletonCount = 3,
}: ActivityListCardProps<T>) {
  return (
    <Card hoverLift>
      <div className="flex items-center justify-between border-b border-border-hairline p-4">
        <h2 className="text-sm font-semibold text-ink-primary">{title}</h2>
        <Link href={viewAllTo} className="text-xs font-semibold text-accent hover:underline">
          View all
        </Link>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: skeletonCount }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <ul className="divide-y divide-border-hairline">
            {items.map((item) => (
              <li key={rowKey(item)} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-primary">{renderPrimary(item)}</p>
                  <p className="text-xs text-ink-muted">{renderSecondary(item)}</p>
                </div>
                {renderBadge(item)}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    </Card>
  );
}
