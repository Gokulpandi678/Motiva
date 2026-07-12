import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-border-hairline bg-surface px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted',
        'transition-shadow duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'min-h-24 resize-y',
        className,
      )}
      {...props}
    />
  );
}
