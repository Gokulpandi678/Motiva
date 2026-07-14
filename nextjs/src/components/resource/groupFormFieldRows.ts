import type { FieldConfig } from './types';

const FULL_WIDTH_TYPES = new Set(['textarea', 'tags', 'boolean']);

function isFullWidthField(field: FieldConfig): boolean {
  return FULL_WIDTH_TYPES.has(field.type);
}

/**
 * Packs consecutive compact fields (dropdowns, dates, numbers, short text…)
 * two to a row, while textareas/tag pickers/switches always get their own
 * full-width row — keeps long forms from feeling like an endless single column.
 */
export function groupFormFieldRows(fields: FieldConfig[]): FieldConfig[][] {
  const rows: FieldConfig[][] = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    if (isFullWidthField(field)) {
      rows.push([field]);
      i += 1;
      continue;
    }
    const next = fields[i + 1];
    if (next && !isFullWidthField(next)) {
      rows.push([field, next]);
      i += 2;
    } else {
      rows.push([field]);
      i += 1;
    }
  }
  return rows;
}
