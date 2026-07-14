'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Switch({ checked, onChange, disabled, label }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-2', disabled ? 'opacity-50' : 'cursor-pointer')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          checked ? 'bg-accent-gradient' : 'bg-border-hairline',
        )}
      >
        <motion.span
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm"
        />
      </button>
      {label ? <span className="text-sm font-medium text-ink-primary">{label}</span> : null}
    </label>
  );
}
