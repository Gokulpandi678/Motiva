'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { INTERACTION_TYPE_META } from '@/config/enums';
import { formatRelative } from '@/lib/utils/date';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePeopleSearch } from '@/hooks/queries/useRelationships';

interface PersonPickerFieldProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}

/** Autocompletes against people already logged, and surfaces their last interaction as a memory-jog. */
export function PersonPickerField({ value, onChange, placeholder }: PersonPickerFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebouncedValue(value, 200);
  const { data: matches } = usePeopleSearch({ q: debounced || undefined, limit: 6 });

  const suggestions = useMemo(
    () => (matches ?? []).filter((person) => person.personName.toLowerCase() !== value.trim().toLowerCase()),
    [matches, value],
  );

  const exactMatch = useMemo(
    () => (matches ?? []).find((person) => person.personName.toLowerCase() === value.trim().toLowerCase()),
    [matches, value],
  );

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div className="relative">
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
      />

      <AnimatePresence>
        {showDropdown ? (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border-hairline bg-surface py-1 shadow-lg"
          >
            {suggestions.map((person) => (
              <li key={person.personName}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(person.personName);
                    setIsFocused(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink-primary hover:bg-accent-soft"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cat-violet-soft text-cat-violet">
                    <User className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-medium">{person.personName}</span>
                    <span className="ml-2 text-xs text-ink-muted">
                      {INTERACTION_TYPE_META[person.lastInteractionType].label} · {formatRelative(person.lastInteractionAt)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      {exactMatch ? (
        <p className="mt-1.5 text-xs text-ink-muted">
          Last: {exactMatch.lastContext ?? INTERACTION_TYPE_META[exactMatch.lastInteractionType].label},{' '}
          {formatRelative(exactMatch.lastInteractionAt)}
        </p>
      ) : null}
    </div>
  );
}
