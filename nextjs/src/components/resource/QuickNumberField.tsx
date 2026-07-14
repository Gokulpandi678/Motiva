'use client';

import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';
import type { NumberPreset } from './types';

interface QuickNumberFieldProps {
  value: number | undefined;
  onChange: (value: number) => void;
  presets: NumberPreset[];
}

/** Most durations cluster around a few values; typing an exact number every time is friction for little precision gain. */
export function QuickNumberField({ value, onChange, presets }: QuickNumberFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const active = value === preset.value;
          return (
            <motion.button
              key={preset.label}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(preset.value)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                active
                  ? 'border-transparent bg-accent-gradient text-accent-ink shadow-sm shadow-accent-glow'
                  : 'border-border-hairline text-ink-secondary hover:border-accent/40 hover:bg-accent-soft hover:text-accent',
              )}
            >
              <Timer className="size-3" />
              {preset.label}
            </motion.button>
          );
        })}
      </div>
      <Input
        type="number"
        min={1}
        value={value ?? ''}
        placeholder="Custom (minutes)"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
