'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/types/common';
import { IconButton } from './IconButton';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta;
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border-hairline px-4 py-3">
      <p className="text-sm text-ink-muted tabular-nums">
        {total === 0 ? 'No results' : `${rangeStart}–${rangeEnd} of ${total}`}
      </p>
      <div className="flex items-center gap-1">
        <IconButton
          icon={<ChevronLeft className="size-4" />}
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <span className="px-2 text-sm text-ink-secondary tabular-nums">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <IconButton
          icon={<ChevronRight className="size-4" />}
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}
