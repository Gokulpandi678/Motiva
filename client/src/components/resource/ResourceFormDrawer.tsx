import { useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { ResourceForm } from './ResourceForm';
import { useResourceForm } from './useResourceForm';
import type { FormValues, ResourceConfig, ResourceHooks } from './types';

interface ResourceFormDrawerProps<Entity extends { id: string }, ListQuery, CreateInput, UpdateInput> {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  config: ResourceConfig<Entity, CreateInput, UpdateInput>;
  hooks: ResourceHooks<Entity, ListQuery, CreateInput, UpdateInput>;
  editing?: Entity | null;
  /** Merged over `config.emptyValues` on create — e.g. quick-capture's parsed draft. */
  initialValuesOverride?: FormValues;
}

export function ResourceFormDrawer<Entity extends { id: string }, ListQuery, CreateInput, UpdateInput>({
  open,
  onClose,
  mode,
  config,
  hooks,
  editing,
  initialValuesOverride,
}: ResourceFormDrawerProps<Entity, ListQuery, CreateInput, UpdateInput>) {
  const toast = useToast();
  const initialValues =
    mode === 'edit' && editing ? config.toFormValues(editing) : { ...config.emptyValues, ...initialValuesOverride };
  const { values, errors, setValue, validate } = useResourceForm(config.formFields, initialValues, mode);

  // Backfills fields still at their static default once an async default
  // resolves (e.g. Domain defaulting to whatever you used most recently) —
  // never overwrites a field the user has already changed away from default.
  const dynamicDefaults = config.useCreateDefaults?.() ?? {};
  const dynamicDefaultsKey = JSON.stringify(dynamicDefaults);

  useEffect(() => {
    if (mode !== 'create') return;
    for (const [key, dynamicValue] of Object.entries(dynamicDefaults)) {
      if (dynamicValue === undefined) continue;
      if (values[key] === config.emptyValues[key]) {
        setValue(key, dynamicValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicDefaultsKey, mode]);

  const createMutation = hooks.useCreate?.();
  const updateMutation = hooks.useUpdate?.();
  const isSaving = createMutation?.isPending || updateMutation?.isPending;

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (mode === 'create') {
        await createMutation?.mutateAsync(config.toCreateInput(values));
        toast.success(`${config.labels.singular} created`);
      } else if (editing) {
        await updateMutation?.mutateAsync({ id: editing.id, input: config.toUpdateInput(values) });
        toast.success(`${config.labels.singular} updated`);
      }
      onClose();
    } catch (error) {
      toast.error('Something went wrong', error instanceof ApiError ? error.message : undefined);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={mode === 'create' ? `New ${config.labels.singular}` : `Edit ${config.labels.singular}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSaving}>
            Save
          </Button>
        </>
      }
    >
      <ResourceForm fields={config.formFields} values={values} errors={errors} mode={mode} onChange={setValue} />
    </Drawer>
  );
}
