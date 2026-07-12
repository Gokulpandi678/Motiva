import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeTone =
  | 'neutral'
  | 'good'
  | 'warning'
  | 'serious'
  | 'critical'
  | 'blue'
  | 'aqua'
  | 'yellow'
  | 'green'
  | 'violet'
  | 'red'
  | 'magenta'
  | 'orange';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  title?: string;
}

/**
 * A status color is never the sole carrier of meaning here: every tone pairs a
 * small solid dot with a label rendered in the ink token, never colored text —
 * the tint just gives each tone its own colorful pill background.
 */
const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-muted',
  good: 'bg-status-good',
  warning: 'bg-status-warning',
  serious: 'bg-status-serious',
  critical: 'bg-status-critical',
  blue: 'bg-cat-blue',
  aqua: 'bg-cat-aqua',
  yellow: 'bg-cat-yellow',
  green: 'bg-cat-green',
  violet: 'bg-cat-violet',
  red: 'bg-cat-red',
  magenta: 'bg-cat-magenta',
  orange: 'bg-cat-orange',
};

const SOFT_BG_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-hover',
  good: 'bg-status-good-soft',
  warning: 'bg-status-warning-soft',
  serious: 'bg-status-serious-soft',
  critical: 'bg-status-critical-soft',
  blue: 'bg-cat-blue-soft',
  aqua: 'bg-cat-aqua-soft',
  yellow: 'bg-cat-yellow-soft',
  green: 'bg-cat-green-soft',
  violet: 'bg-cat-violet-soft',
  red: 'bg-cat-red-soft',
  magenta: 'bg-cat-magenta-soft',
  orange: 'bg-cat-orange-soft',
};

export function Badge({ tone = 'neutral', children, icon, className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-primary',
        'transition-transform duration-150 hover:scale-105',
        SOFT_BG_CLASSES[tone],
        className,
      )}
    >
      {icon ?? <span className={cn('size-1.5 shrink-0 rounded-full', DOT_CLASSES[tone])} />}
      {children}
    </span>
  );
}
