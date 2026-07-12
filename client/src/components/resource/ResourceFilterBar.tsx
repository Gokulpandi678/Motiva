import { useEffect, useRef, useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { FilterFieldConfig } from './types';

interface ResourceFilterBarProps {
  filters: FilterFieldConfig[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function ResourceFilterBar({ filters, values, onChange }: ResourceFilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) =>
        filter.type === 'search' ? (
          <SearchFilter
            key={filter.name}
            filter={filter}
            value={values[filter.name] ?? ''}
            onChange={(value) => onChange(filter.name, value)}
          />
        ) : (
          <Select
            key={filter.name}
            className="w-44"
            placeholder={filter.placeholder}
            options={filter.options ?? []}
            value={values[filter.name] ?? ''}
            onChange={(event) => onChange(filter.name, event.target.value)}
          />
        ),
      )}
    </div>
  );
}

function SearchFilter({
  filter,
  value,
  onChange,
}: {
  filter: FilterFieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const debounced = useDebouncedValue(draft, 300);

  // `onChange` is a fresh closure on every parent render (it's created inline
  // in ResourceFilterBar), so it can't be a dependency here without retriggering
  // this effect every render — a ref keeps the effect keyed only on `debounced`.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current(debounced);
  }, [debounced]);

  return <SearchInput value={draft} onChange={setDraft} placeholder={filter.placeholder} className="w-64" />;
}
