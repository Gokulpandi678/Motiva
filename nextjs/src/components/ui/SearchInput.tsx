'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-lg border border-border-hairline bg-surface pl-8 pr-3 text-sm text-ink-primary placeholder:text-ink-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
        )}
      />
    </div>
  );
}
