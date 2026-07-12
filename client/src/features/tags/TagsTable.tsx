import { Merge, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { TagWithUsage } from '@/types/tag';

interface TagsTableProps {
  tags: TagWithUsage[] | undefined;
  isLoading: boolean;
  onRename: (tag: TagWithUsage) => void;
  onMerge: (tag: TagWithUsage) => void;
  onDelete: (tag: TagWithUsage) => void;
}

export function TagsTable({ tags, isLoading, onRename, onMerge, onDelete }: TagsTableProps) {
  return (
    <Card>
      <div className="border-b border-border-hairline p-4">
        <h2 className="text-sm font-semibold text-ink-primary">Tags</h2>
        <p className="mt-0.5 text-xs text-ink-muted">Shared between Tickets and Learnings.</p>
      </div>
      <Table<TagWithUsage>
        columns={[
          { key: 'name', header: 'Tag', render: (row) => <span className="font-medium">{row.name}</span> },
          { key: 'ticketCount', header: 'Tickets', className: 'tabular-nums', render: (row) => row.ticketCount },
          { key: 'learningCount', header: 'Learnings', className: 'tabular-nums', render: (row) => row.learningCount },
          { key: 'usageCount', header: 'Total uses', className: 'tabular-nums', render: (row) => row.usageCount },
        ]}
        rows={tags ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        emptyState={<EmptyState title="No tags yet" description="Tags appear once you log a ticket or learning." />}
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <IconButton icon={<Pencil className="size-4" />} aria-label="Rename tag" onClick={() => onRename(row)} />
            <IconButton icon={<Merge className="size-4" />} aria-label="Merge tag" onClick={() => onMerge(row)} />
            <IconButton icon={<Trash2 className="size-4" />} aria-label="Delete tag" onClick={() => onDelete(row)} />
          </div>
        )}
      />
    </Card>
  );
}
