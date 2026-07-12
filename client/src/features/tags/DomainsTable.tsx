import { Pencil } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelative } from '@/lib/utils/date';
import type { DomainActivity } from '@/types/domain';

interface DomainsTableProps {
  domains: DomainActivity[] | undefined;
  isLoading: boolean;
  onRename: (domain: DomainActivity) => void;
}

export function DomainsTable({ domains, isLoading, onRename }: DomainsTableProps) {
  return (
    <Card>
      <div className="border-b border-border-hairline p-4">
        <h2 className="text-sm font-semibold text-ink-primary">Learning domains</h2>
        <p className="mt-0.5 text-xs text-ink-muted">Renaming folds one domain into another across every learning.</p>
      </div>
      <Table<DomainActivity>
        columns={[
          { key: 'domain', header: 'Domain', render: (row) => <span className="font-medium">{row.domain}</span> },
          { key: 'count', header: 'Learnings', className: 'tabular-nums', render: (row) => row.count },
          { key: 'lastUsedAt', header: 'Last used', render: (row) => formatRelative(row.lastUsedAt) },
        ]}
        rows={domains ?? []}
        rowKey={(row) => row.domain}
        isLoading={isLoading}
        emptyState={<EmptyState title="No domains yet" />}
        rowActions={(row) => (
          <IconButton icon={<Pencil className="size-4" />} aria-label="Rename domain" onClick={() => onRename(row)} />
        )}
      />
    </Card>
  );
}
