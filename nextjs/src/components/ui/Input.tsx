import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-xl border border-border-hairline bg-surface px-3 text-sm text-ink-primary placeholder:text-ink-muted',
        'transition-shadow duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
