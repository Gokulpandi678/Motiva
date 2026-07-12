import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { BadgeTone } from '@/components/ui/Badge';
import type { SelectOption } from '@/components/ui/Select';

interface SegmentedFieldProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const ACTIVE_CLASS: Record<BadgeTone, string> = {
  neutral: 'bg-ink-muted text-white',
  good: 'bg-status-good text-white',
  warning: 'bg-status-warning text-white',
  serious: 'bg-status-serious text-white',
  critical: 'bg-status-critical text-white',
  blue: 'bg-cat-blue text-white',
  aqua: 'bg-cat-aqua text-white',
  yellow: 'bg-cat-yellow text-white',
  green: 'bg-cat-green text-white',
  violet: 'bg-cat-violet text-white',
  red: 'bg-cat-red text-white',
  magenta: 'bg-cat-magenta text-white',
  orange: 'bg-cat-orange text-white',
};

const SOFT_CLASS: Record<BadgeTone, string> = {
  neutral: 'bg-surface-hover text-ink-secondary',
  good: 'bg-status-good-soft text-status-good',
  warning: 'bg-status-warning-soft text-status-warning',
  serious: 'bg-status-serious-soft text-status-serious',
  critical: 'bg-status-critical-soft text-status-critical',
  blue: 'bg-cat-blue-soft text-cat-blue',
  aqua: 'bg-cat-aqua-soft text-cat-aqua',
  yellow: 'bg-cat-yellow-soft text-cat-yellow',
  green: 'bg-cat-green-soft text-cat-green',
  violet: 'bg-cat-violet-soft text-cat-violet',
  red: 'bg-cat-red-soft text-cat-red',
  magenta: 'bg-cat-magenta-soft text-cat-magenta',
  orange: 'bg-cat-orange-soft text-cat-orange',
};

/** A tone-colored pill picker for short, fixed option sets (priority, difficulty…) — quicker to scan and click than a dropdown. */
export function SegmentedField({ options, value, onChange }: SegmentedFieldProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        const tone = option.tone ?? 'neutral';
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors',
              active ? ACTIVE_CLASS[tone] : cn(SOFT_CLASS[tone], 'shadow-none hover:brightness-95'),
            )}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
