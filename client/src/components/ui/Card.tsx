import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Lifts + brightens the border on hover — use for clickable/interactive cards. */
  hoverLift?: boolean;
}

export function Card({ className, hoverLift = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-hairline bg-surface shadow-sm transition-all duration-200',
        hoverLift && 'cursor-pointer hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg',
        className,
      )}
      {...props}
    />
  );
}
