'use client';

import type { ReactNode } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

interface ResourceRowActionsProps<Entity> {
  row: Entity;
  singularLabel: string;
  canEdit: boolean;
  canDelete: boolean;
  extra?: ReactNode;
  onEdit: (row: Entity) => void;
  onDelete: (row: Entity) => void;
}

export function ResourceRowActions<Entity>({
  row,
  singularLabel,
  canEdit,
  canDelete,
  extra,
  onEdit,
  onDelete,
}: ResourceRowActionsProps<Entity>) {
  return (
    <div className="flex items-center justify-end gap-1">
      {extra}
      {canEdit ? (
        <IconButton icon={<Pencil className="size-4" />} aria-label={`Edit ${singularLabel}`} onClick={() => onEdit(row)} />
      ) : null}
      {canDelete ? (
        <IconButton icon={<Trash2 className="size-4" />} aria-label={`Delete ${singularLabel}`} onClick={() => onDelete(row)} />
      ) : null}
    </div>
  );
}
