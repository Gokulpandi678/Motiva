import { type KeyboardEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { tagTone, tagToneDotClass } from '@/lib/utils/tagTone';
import { Badge } from '@/components/ui/Badge';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTagSearch } from '@/hooks/queries/useTags';

interface TagPickerFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/**
 * Most tickets/learnings reuse the same handful of tags, so the common case
 * should cost a click, not a full retype: top-used tags always show as
 * one-click chips, and typing fuzzy-matches against real tags before falling
 * back to "create new" — which also keeps casing/typo duplicates (e.g.
 * "tech" vs "Technology") from multiplying in the first place.
 */
export function TagPickerField({ value, onChange, placeholder = 'Add a tag…' }: TagPickerFieldProps) {
  const [draft, setDraft] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebouncedValue(draft, 200);

  const { data: topTags } = useTagSearch({ limit: 10 });
  const { data: matches } = useTagSearch({ q: debounced, limit: 8 }, debounced.trim().length > 0);

  const suggestions = useMemo(() => {
    const source = debounced.trim() ? matches ?? [] : topTags ?? [];
    return source.filter((tag) => !value.includes(tag.name));
  }, [debounced, matches, topTags, value]);

  const exactMatchExists = suggestions.some((tag) => tag.name === draft.trim().toLowerCase());
  const showCreateOption = draft.trim().length > 0 && !exactMatchExists;

  const addTag = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized]);
    }
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (draft.trim()) addTag(draft);
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (event.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || showCreateOption);

  return (
    <div className="relative">
      <div
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-xl border border-border-hairline bg-surface px-2 py-1.5 transition-shadow',
          'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40',
        )}
      >
        {value.map((tag) => (
          <Badge key={tag} tone={tagTone(tag)} className="py-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-ink-primary/60 hover:text-ink-primary"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-24 flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {showDropdown ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border-hairline bg-surface shadow-lg"
          >
            {!debounced.trim() && suggestions.length > 0 ? (
              <p className="px-3 pt-2 text-xs font-semibold text-ink-muted">Most used</p>
            ) : null}
            <ul className="max-h-56 overflow-y-auto py-1">
              {suggestions.map((tag) => (
                <li key={tag.id}>
                  <button
                    type="button"
                    onClick={() => addTag(tag.name)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-accent-soft"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn('size-2 rounded-full', tagToneDotClass(tag.name))} />
                      <span className="text-ink-primary">{tag.name}</span>
                    </span>
                    <span className="text-xs text-ink-muted tabular-nums">{tag.usageCount}</span>
                  </button>
                </li>
              ))}
              {showCreateOption ? (
                <li>
                  <button
                    type="button"
                    onClick={() => addTag(draft)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-sm font-medium text-accent hover:bg-accent-soft"
                  >
                    <Plus className="size-3.5" />
                    Create "{draft.trim().toLowerCase()}"
                  </button>
                </li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
