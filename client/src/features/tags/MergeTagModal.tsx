import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { TagWithUsage } from '@/types/tag';

interface MergeTagModalProps {
  source: TagWithUsage | null;
  candidates: TagWithUsage[];
  isLoading?: boolean;
  onSubmit: (targetTagId: string) => void;
  onCancel: () => void;
}

export function MergeTagModal({ source, candidates, isLoading, onSubmit, onCancel }: MergeTagModalProps) {
  const [targetTagId, setTargetTagId] = useState('');

  const options = candidates
    .filter((tag) => tag.id !== source?.id)
    .map((tag) => ({ value: tag.id, label: `${tag.name} (${tag.usageCount} uses)` }));

  return (
    <Modal
      open={Boolean(source)}
      onClose={onCancel}
      title={`Merge "${source?.name}" into…`}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => targetTagId && onSubmit(targetTagId)}
            isLoading={isLoading}
            disabled={!targetTagId}
          >
            Merge
          </Button>
        </>
      }
    >
      <div className="space-y-2 text-left">
        <p className="text-sm text-ink-secondary">
          Every ticket and learning tagged "{source?.name}" will be re-tagged with the target instead, and "
          {source?.name}" will be removed.
        </p>
        <Select
          placeholder="Choose a target tag…"
          options={options}
          value={targetTagId}
          onChange={(event) => setTargetTagId(event.target.value)}
        />
      </div>
    </Modal>
  );
}
