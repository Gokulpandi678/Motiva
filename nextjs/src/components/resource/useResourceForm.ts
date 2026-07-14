import { useState } from 'react';
import type { FieldConfig, FormValues } from './types';

export function useResourceForm(
  fields: FieldConfig[],
  initialValues: FormValues,
  mode: 'create' | 'edit',
) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (name: string, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      if (mode === 'create' && field.editOnly) continue;
      if (mode === 'edit' && field.createOnly) continue;
      if (!field.required) continue;

      const value = values[field.name];
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) nextErrors[field.name] = `${field.label} is required`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return { values, errors, setValue, validate };
}
