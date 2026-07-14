'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { RatingStars } from '@/components/ui/RatingStars';
import { TagPickerField } from './TagPickerField';
import { DomainPickerField } from './DomainPickerField';
import { QuickDateField } from './QuickDateField';
import { QuickNumberField } from './QuickNumberField';
import { PersonPickerField } from './PersonPickerField';
import { SegmentedField } from './SegmentedField';
import type { FieldConfig } from './types';

interface ResourceFieldControlProps {
  field: FieldConfig;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export function ResourceFieldControl({ field, value, onChange }: ResourceFieldControlProps) {
  switch (field.type) {
    case 'text':
      return (
        <>
          <Input
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            list={field.suggestions ? `${field.name}-suggestions` : undefined}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
          {field.suggestions ? (
            <datalist id={`${field.name}-suggestions`}>
              {field.suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          ) : null}
        </>
      );
    case 'textarea':
      return (
        <Textarea
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      );
    case 'number':
      return (
        <Input
          type="number"
          min={field.min}
          max={field.max}
          value={(value as number) ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.name, Number(event.target.value))}
        />
      );
    case 'quick-number':
      return (
        <QuickNumberField
          value={value as number | undefined}
          onChange={(next) => onChange(field.name, next)}
          presets={field.presets ?? []}
        />
      );
    case 'date':
      return (
        <Input type="date" value={(value as string) ?? ''} onChange={(event) => onChange(field.name, event.target.value)} />
      );
    case 'quick-date':
      return <QuickDateField value={(value as string) ?? ''} onChange={(next) => onChange(field.name, next)} />;
    case 'select':
      return (
        <Select
          options={field.options ?? []}
          value={(value as string) ?? ''}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      );
    case 'segmented':
      return (
        <SegmentedField
          options={field.options ?? []}
          value={(value as string) ?? ''}
          onChange={(next) => onChange(field.name, next)}
        />
      );
    case 'tags':
      return (
        <TagPickerField
          value={(value as string[]) ?? []}
          onChange={(tags) => onChange(field.name, tags)}
          placeholder={field.placeholder}
        />
      );
    case 'domain':
      return (
        <DomainPickerField
          value={(value as string) ?? ''}
          onChange={(next) => onChange(field.name, next)}
          placeholder={field.placeholder}
          staticSuggestions={field.suggestions ?? []}
        />
      );
    case 'person':
      return (
        <PersonPickerField
          value={(value as string) ?? ''}
          onChange={(next) => onChange(field.name, next)}
          placeholder={field.placeholder}
        />
      );
    case 'rating':
      return (
        <div className="flex items-center gap-2">
          <RatingStars size="md" value={(value as number) ?? 0} onChange={(rating) => onChange(field.name, rating)} />
          <span className="text-xs font-medium tabular-nums text-ink-muted">{(value as number) ?? 0}/5</span>
        </div>
      );
    default:
      return null;
  }
}
