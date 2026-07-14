'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils/cn';
import { FormField } from '@/components/ui/FormField';
import { Switch } from '@/components/ui/Switch';
import { ResourceFieldControl } from './ResourceFieldControl';
import { groupFormFieldRows } from './groupFormFieldRows';
import type { FieldConfig, FormValues } from './types';

interface ResourceFormProps {
  fields: FieldConfig[];
  values: FormValues;
  errors?: Record<string, string>;
  mode: 'create' | 'edit';
  onChange: (name: string, value: unknown) => void;
}

export function ResourceForm({ fields, values, errors, mode, onChange }: ResourceFormProps) {
  const visibleFields = fields.filter((field) => {
    if (mode === 'create' && field.editOnly) return false;
    if (mode === 'edit' && field.createOnly) return false;
    return true;
  });

  const rows = groupFormFieldRows(visibleFields);

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col gap-3">
          <div className={cn('grid gap-4', row.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
            {row.map((field) => (
              <FieldCell key={field.name} field={field} value={values[field.name]} error={errors?.[field.name]} onChange={onChange} />
            ))}
          </div>
          {row.map((field) => (
            <Fragment key={`${field.name}-after`}>{field.renderAfter?.({ values, setValue: onChange })}</Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

interface FieldCellProps {
  field: FieldConfig;
  value: unknown;
  error?: string;
  onChange: (name: string, value: unknown) => void;
}

function FieldCell({ field, value, error, onChange }: FieldCellProps) {
  if (field.type === 'boolean') {
    return <Switch label={field.label} checked={Boolean(value)} onChange={(checked) => onChange(field.name, checked)} />;
  }

  return (
    <FormField label={field.label} required={field.required} error={error} hint={field.hint}>
      <ResourceFieldControl field={field} value={value} onChange={onChange} />
    </FormField>
  );
}
