import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { BadgeTone } from './Badge';

export interface SelectOption {
  value: string;
  label: string;
  /** Only consulted by segmented-style controls (e.g. SegmentedField); ignored by the native select. */
  tone?: BadgeTone;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="group relative">
      <select
        className={cn(
          'h-9 w-full appearance-none rounded-xl border border-border-hairline bg-surface px-3 pr-8 text-sm font-medium text-ink-primary',
          'transition-all duration-150 hover:border-accent/50',
          'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted transition-colors group-hover:text-accent" />
    </div>
  );
}
