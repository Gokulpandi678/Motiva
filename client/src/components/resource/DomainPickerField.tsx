import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDomainSearch } from '@/hooks/queries/useLearnings';

interface DomainPickerFieldProps {
  value: string;
  onChange: (domain: string) => void;
  placeholder?: string;
  staticSuggestions: string[];
}

/** Merges the fixed preset list with domains you've actually used, most-recent first. */
export function DomainPickerField({ value, onChange, placeholder, staticSuggestions }: DomainPickerFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebouncedValue(value, 200);
  const { data: usedDomains } = useDomainSearch({ q: debounced || undefined, limit: 8 });

  const suggestions = useMemo(() => {
    const used = (usedDomains ?? []).map((entry) => entry.domain);
    const merged = [...used];
    for (const preset of staticSuggestions) {
      if (!merged.some((domain) => domain.toLowerCase() === preset.toLowerCase())) {
        merged.push(preset);
      }
    }
    const query = value.trim().toLowerCase();
    const filtered = query ? merged.filter((domain) => domain.toLowerCase().includes(query)) : merged;
    return filtered.filter((domain) => domain.toLowerCase() !== query).slice(0, 8);
  }, [usedDomains, staticSuggestions, value]);

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
            {suggestions.map((domain) => (
              <li key={domain}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(domain);
                    setIsFocused(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink-primary hover:bg-accent-soft"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cat-aqua-soft text-cat-aqua">
                    <Folder className="size-3.5" />
                  </span>
                  {domain}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
