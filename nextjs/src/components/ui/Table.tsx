'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './Skeleton';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  skeletonRowCount?: number;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
}

/**
 * Renders as a real `<table>` from `md` up, and as a stacked list of cards
 * below that — a shrunk table with 2-3 truncated columns doesn't read as a
 * mobile app, a card per row does. Every resource page (Tickets, Tasks,
 * Learnings, Relationships, FAQs, Tags, Topics, Skills) renders through this
 * one component, so this is the single place that needs to know about it.
 * The first column becomes each card's heading; the rest render as small
 * label/value pairs underneath — no per-resource config needed since every
 * column already knows how to render itself.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  skeletonRowCount = 6,
  emptyState,
  onRowClick,
  rowActions,
}: TableProps<T>) {
  const showEmpty = !isLoading && rows.length === 0;
  const [heroColumn, ...restColumns] = columns;

  return (
    <div>
      {/* Table — md and up */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-hairline text-xs font-semibold tracking-wide text-accent uppercase">
              {columns.map((column) => (
                <th key={column.key} className={cn('px-4 py-2.5', column.className)}>
                  {column.header}
                </th>
              ))}
              {rowActions ? <th className="px-4 py-2.5" /> : null}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: skeletonRowCount }, (_, index) => (
                <tr key={index} className="border-b border-border-hairline last:border-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-40" />
                    </td>
                  ))}
                  {rowActions ? <td className="px-4 py-3" /> : null}
                </tr>
              ))}

            {!isLoading &&
              rows.map((row, index) => (
                <motion.tr
                  key={rowKey(row)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.02 }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-border-hairline last:border-0 transition-colors duration-150',
                    onRowClick && 'cursor-pointer hover:bg-accent-soft/60',
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3 text-ink-primary', column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                  {rowActions ? (
                    <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  ) : null}
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Cards — below md */}
      <div className="space-y-2.5 p-3 md:hidden">
        {isLoading &&
          Array.from({ length: Math.min(skeletonRowCount, 4) }, (_, index) => (
            <div key={index} className="rounded-2xl border border-border-hairline bg-surface p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-3 w-1/3" />
            </div>
          ))}

        {!isLoading &&
          rows.map((row, index) => (
            <motion.div
              key={rowKey(row)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.02 }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'rounded-2xl border border-border-hairline bg-surface p-4 shadow-sm transition-colors duration-150',
                onRowClick && 'cursor-pointer active:bg-accent-soft/60',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-ink-primary">{heroColumn?.render(row)}</div>
                {rowActions ? (
                  <div
                    className="-mr-1.5 -mt-1 shrink-0"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {rowActions(row)}
                  </div>
                ) : null}
              </div>

              {restColumns.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2.5 border-t border-border-hairline pt-3">
                  {restColumns.map((column) => (
                    <div key={column.key} className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-wide text-ink-muted uppercase">
                        {column.header}
                      </p>
                      <div className="mt-0.5 text-sm text-ink-primary">{column.render(row)}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
      </div>

      {showEmpty ? emptyState : null}
    </div>
  );
}
