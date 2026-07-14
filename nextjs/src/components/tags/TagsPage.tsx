'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PromptModal } from '@/components/ui/PromptModal';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { useDeleteTag, useMergeTag, useRenameTag, useTagSearch } from '@/hooks/queries/useTags';
import { useDomainSearch, useRenameDomain } from '@/hooks/queries/useLearnings';
import type { TagWithUsage } from '@/types/tag';
import type { DomainActivity } from '@/types/domain';
import { MergeTagModal } from './MergeTagModal';
import { TagsTable } from './TagsTable';
import { DomainsTable } from './DomainsTable';

const ADMIN_LIST_LIMIT = 200;

export function TagsPage() {
  const toast = useToast();
  const { data: tags, isLoading: tagsLoading } = useTagSearch({ limit: ADMIN_LIST_LIMIT });
  const { data: domains, isLoading: domainsLoading } = useDomainSearch({ limit: ADMIN_LIST_LIMIT });

  const [renameTarget, setRenameTarget] = useState<TagWithUsage | null>(null);
  const [mergeTarget, setMergeTarget] = useState<TagWithUsage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TagWithUsage | null>(null);
  const [renameDomainTarget, setRenameDomainTarget] = useState<DomainActivity | null>(null);

  const renameTagMutation = useRenameTag();
  const mergeTagMutation = useMergeTag();
  const deleteTagMutation = useDeleteTag();
  const renameDomainMutation = useRenameDomain();

  const handleRenameTag = async (name: string) => {
    if (!renameTarget) return;
    try {
      await renameTagMutation.mutateAsync({ id: renameTarget.id, input: { name } });
      toast.success(`Tag renamed to "${name}"`);
      setRenameTarget(null);
    } catch (error) {
      toast.error('Could not rename tag', error instanceof ApiError ? error.message : undefined);
    }
  };

  const handleMergeTag = async (targetTagId: string) => {
    if (!mergeTarget) return;
    try {
      await mergeTagMutation.mutateAsync({ id: mergeTarget.id, input: { targetTagId } });
      toast.success(`Merged "${mergeTarget.name}"`);
      setMergeTarget(null);
    } catch (error) {
      toast.error('Could not merge tag', error instanceof ApiError ? error.message : undefined);
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTagMutation.mutateAsync(deleteTarget.id);
      toast.success(`Deleted "${deleteTarget.name}"`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not delete tag', error instanceof ApiError ? error.message : undefined);
    }
  };

  const handleRenameDomain = async (to: string) => {
    if (!renameDomainTarget) return;
    try {
      await renameDomainMutation.mutateAsync({ from: renameDomainTarget.domain, to });
      toast.success(`Renamed "${renameDomainTarget.domain}" to "${to}"`);
      setRenameDomainTarget(null);
    } catch (error) {
      toast.error('Could not rename domain', error instanceof ApiError ? error.message : undefined);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Tags & Domains"
        description="Clean up typos and duplicates — renaming or merging here updates every ticket and learning that used it."
      />

      <TagsTable
        tags={tags}
        isLoading={tagsLoading}
        onRename={setRenameTarget}
        onMerge={setMergeTarget}
        onDelete={setDeleteTarget}
      />

      <DomainsTable domains={domains} isLoading={domainsLoading} onRename={setRenameDomainTarget} />

      <PromptModal
        open={Boolean(renameTarget)}
        title={`Rename "${renameTarget?.name}"`}
        label="New name"
        initialValue={renameTarget?.name ?? ''}
        isLoading={renameTagMutation.isPending}
        onSubmit={handleRenameTag}
        onCancel={() => setRenameTarget(null)}
      />

      <MergeTagModal
        source={mergeTarget}
        candidates={tags ?? []}
        isLoading={mergeTagMutation.isPending}
        onSubmit={handleMergeTag}
        onCancel={() => setMergeTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name}"`}
        description="This removes the tag from every ticket and learning that used it. This can't be undone."
        isLoading={deleteTagMutation.isPending}
        onConfirm={handleDeleteTag}
        onCancel={() => setDeleteTarget(null)}
      />

      <PromptModal
        open={Boolean(renameDomainTarget)}
        title={`Rename domain "${renameDomainTarget?.domain}"`}
        label="New domain name"
        initialValue={renameDomainTarget?.domain ?? ''}
        isLoading={renameDomainMutation.isPending}
        onSubmit={handleRenameDomain}
        onCancel={() => setRenameDomainTarget(null)}
      />
    </div>
  );
}
