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

  return (
    <div className="overflow-x-auto">
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

      {showEmpty ? emptyState : null}
    </div>
  );
}
