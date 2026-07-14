'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { ResourceFilterBar } from './ResourceFilterBar';
import { ResourceFormDrawer } from './ResourceFormDrawer';
import { ResourceRowActions } from './ResourceRowActions';
import type { ResourceConfig, ResourceHooks, ResourcePageSlots } from './types';

interface ResourcePageProps<Entity extends { id: string }, ListQuery, CreateInput, UpdateInput> {
  config: ResourceConfig<Entity, CreateInput, UpdateInput>;
  hooks: ResourceHooks<Entity, ListQuery, CreateInput, UpdateInput>;
  buildQuery: (filters: Record<string, string>, page: number) => ListQuery;
  description?: string;
  slots?: ResourcePageSlots<Entity>;
}

interface DrawerState<Entity> {
  mode: 'create' | 'edit';
  editing?: Entity;
}

export function ResourcePage<Entity extends { id: string }, ListQuery, CreateInput, UpdateInput>({
  config,
  hooks,
  buildQuery,
  description,
  slots,
}: ResourcePageProps<Entity, ListQuery, CreateInput, UpdateInput>) {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [drawerState, setDrawerState] = useState<DrawerState<Entity> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entity | null>(null);

  const { data, isLoading } = hooks.useList(buildQuery(filterValues, page));
  const removeMutation = hooks.useRemove?.();

  const handleFilterChange = (name: string, value: string) => {
    setFilterValues((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeMutation?.mutateAsync(deleteTarget.id);
      toast.success(`${config.labels.singular} deleted`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not delete', error instanceof ApiError ? error.message : undefined);
    }
  };

  const canEdit = config.canEdit !== false && Boolean(hooks.useUpdate);
  const canDelete = config.canDelete !== false && Boolean(hooks.useRemove);
  const canCreate = config.canCreate !== false && Boolean(hooks.useCreate);
  const hasRowActions = canEdit || canDelete || Boolean(slots?.rowActions);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={config.labels.plural}
        description={description}
        actions={
          <>
            {slots?.headerActions}
            {canCreate ? (
              <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setDrawerState({ mode: 'create' })}>
                New {config.labels.singular}
              </Button>
            ) : null}
          </>
        }
      />

      <Card>
        {(config.filters?.length ?? 0) > 0 ? (
          <div className="border-b border-border-hairline p-4">
            <ResourceFilterBar filters={config.filters ?? []} values={filterValues} onChange={handleFilterChange} />
          </div>
        ) : null}

        <Table
          columns={config.columns}
          rows={data?.items ?? []}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              title={`No ${config.labels.plural.toLowerCase()} yet`}
              description={canCreate ? `Log your first ${config.labels.singular.toLowerCase()} to get started.` : undefined}
            />
          }
          rowActions={
            hasRowActions
              ? (row) => (
                  <ResourceRowActions
                    row={row}
                    singularLabel={config.labels.singular}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    extra={slots?.rowActions?.(row)}
                    onEdit={(target) => setDrawerState({ mode: 'edit', editing: target })}
                    onDelete={setDeleteTarget}
                  />
                )
              : undefined
          }
        />

        {data?.meta ? <Pagination meta={data.meta} onPageChange={setPage} /> : null}
      </Card>

      {drawerState ? (
        <ResourceFormDrawer
          key={drawerState.mode === 'edit' ? drawerState.editing?.id : 'create'}
          open
          onClose={() => setDrawerState(null)}
          mode={drawerState.mode}
          config={config}
          hooks={hooks}
          editing={drawerState.editing}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${config.labels.singular}`}
        description="This action can't be undone."
        isLoading={removeMutation?.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
