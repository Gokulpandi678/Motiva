'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-semibold text-ink-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-gradient" />
        {label}
        {required ? <span className="text-status-critical">*</span> : null}
        {hint ? (
          <span title={hint} aria-label={hint} className="cursor-help text-ink-muted">
            <Info className="size-3.5 shrink-0" />
          </span>
        ) : null}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium text-status-critical"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
