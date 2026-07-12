import { addDays, addMonths, addWeeks, format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarDays, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

interface QuickDateFieldProps {
  value: string;
  onChange: (date: string) => void;
}

const PRESETS: { label: string; getDate: () => Date }[] = [
  { label: 'Tomorrow', getDate: () => addDays(new Date(), 1) },
  { label: '+3 days', getDate: () => addDays(new Date(), 3) },
  { label: '+1 week', getDate: () => addWeeks(new Date(), 1) },
  { label: '+1 month', getDate: () => addMonths(new Date(), 1) },
];

/** One click covers most real usage; the date input underneath still works for anything custom. */
export function QuickDateField({ value, onChange }: QuickDateFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => {
          const presetValue = format(preset.getDate(), 'yyyy-MM-dd');
          const active = value === presetValue;
          return (
            <motion.button
              key={preset.label}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(presetValue)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                active
                  ? 'border-transparent bg-accent-gradient text-accent-ink shadow-sm shadow-accent-glow'
                  : 'border-border-hairline text-ink-secondary hover:border-accent/40 hover:bg-accent-soft hover:text-accent',
              )}
            >
              <CalendarDays className="size-3" />
              {preset.label}
            </motion.button>
          );
        })}
        {value ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 rounded-full border border-border-hairline px-3 py-1 text-xs font-semibold text-ink-muted hover:bg-surface-hover"
          >
            <X className="size-3" />
            Clear
          </motion.button>
        ) : null}
      </div>
      <Input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
