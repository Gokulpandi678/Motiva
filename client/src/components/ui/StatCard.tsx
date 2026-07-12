import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

export type StatCardTone = 'accent' | 'good' | 'warning' | 'critical' | 'aqua' | 'violet' | 'orange' | 'magenta';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  isLoading?: boolean;
  tone?: StatCardTone;
}

const ICON_TONE_CLASS: Record<StatCardTone, string> = {
  accent: 'bg-accent-soft text-accent',
  good: 'bg-status-good-soft text-status-good',
  warning: 'bg-status-warning-soft text-status-warning',
  critical: 'bg-status-critical-soft text-status-critical',
  aqua: 'bg-cat-aqua-soft text-cat-aqua',
  violet: 'bg-cat-violet-soft text-cat-violet',
  orange: 'bg-cat-orange-soft text-cat-orange',
  magenta: 'bg-cat-magenta-soft text-cat-magenta',
};

export function StatCard({ label, value, icon, hint, isLoading, tone = 'accent' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card hoverLift className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-sm text-ink-muted">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-7 w-16" />
          ) : (
            <p className="mt-1 text-2xl font-bold tabular-nums text-ink-primary">{value}</p>
          )}
          {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
        </div>
        {icon ? (
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
              ICON_TONE_CLASS[tone],
            )}
          >
            {icon}
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
