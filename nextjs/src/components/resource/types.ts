import type { ReactNode } from 'react';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { ListResult } from '@/types/common';
import type { TableColumn } from '@/components/ui/Table';
import type { SelectOption } from '@/components/ui/Select';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'quick-number'
  | 'select'
  | 'segmented'
  | 'tags'
  | 'domain'
  | 'person'
  | 'boolean'
  | 'date'
  | 'quick-date'
  | 'rating';

export type FormValues = Record<string, unknown>;

export interface NumberPreset {
  label: string;
  value: number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  /** Autocomplete suggestions for a 'text' field, without restricting input to a closed set. */
  suggestions?: string[];
  /** Quick-select chips for a 'quick-number' field (e.g. 15m / 30m / 1h / 2h). */
  presets?: NumberPreset[];
  /**
   * Renders extra UI immediately after this field (e.g. a "similar ticket"
   * nudge after Title). Receives the live form values and a setter so it can
   * populate other fields — e.g. copying tags from a matched record.
   */
  renderAfter?: (ctx: { values: FormValues; setValue: (name: string, value: unknown) => void }) => ReactNode;
  /** Hidden when editing an existing record (e.g. the "generate FAQ" toggle). */
  createOnly?: boolean;
  /** Hidden when creating a new record. */
  editOnly?: boolean;
}

export type FilterFieldType = 'search' | 'select';

export interface FilterFieldConfig {
  name: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: SelectOption[];
}

export interface ResourceConfig<Entity, CreateInput, UpdateInput> {
  key: string;
  labels: { singular: string; plural: string };
  columns: TableColumn<Entity>[];
  formFields: FieldConfig[];
  filters?: FilterFieldConfig[];
  emptyValues: FormValues;
  toFormValues: (entity: Entity) => FormValues;
  toCreateInput: (values: FormValues) => CreateInput;
  toUpdateInput: (values: FormValues) => UpdateInput;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  /**
   * Optional hook (must follow rules-of-hooks — called unconditionally every
   * render) returning defaults to backfill on the create form once resolved,
   * e.g. defaulting Domain to whatever you used most recently.
   */
  useCreateDefaults?: () => Partial<FormValues>;
}

export interface ResourceHooks<Entity, ListQuery, CreateInput, UpdateInput> {
  useList: (query: ListQuery) => UseQueryResult<ListResult<Entity>, Error>;
  useCreate?: () => UseMutationResult<Entity, Error, CreateInput>;
  useUpdate?: () => UseMutationResult<Entity, Error, { id: string; input: UpdateInput }>;
  useRemove?: () => UseMutationResult<void, Error, string>;
}

export interface ResourcePageSlots<Entity> {
  rowActions?: (row: Entity) => ReactNode;
  headerActions?: ReactNode;
}
