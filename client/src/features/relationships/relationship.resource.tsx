import { Badge } from '@/components/ui/Badge';
import type { TableColumn } from '@/components/ui/Table';
import type { ResourceConfig } from '@/components/resource/types';
import { formatDate, toDateInputValue } from '@/lib/utils/date';
import { INTERACTION_TYPE_META } from '@/config/enums';
import {
  INTERACTION_TYPES,
  type CreateRelationshipInput,
  type Relationship,
  type UpdateRelationshipInput,
} from '@/types/relationship';
import { FollowUpBadge } from './FollowUpBadge';

const columns: TableColumn<Relationship>[] = [
  {
    key: 'personName',
    header: 'Person',
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-primary">{row.personName}</p>
        {row.context ? <p className="truncate text-xs text-ink-muted">{row.context}</p> : null}
      </div>
    ),
  },
  {
    key: 'interactionType',
    header: 'Interaction',
    render: (row) => (
      <Badge tone={INTERACTION_TYPE_META[row.interactionType].tone}>
        {INTERACTION_TYPE_META[row.interactionType].label}
      </Badge>
    ),
  },
  {
    key: 'followUpDate',
    header: 'Follow-up',
    render: (row) => <FollowUpBadge row={row} />,
  },
  {
    key: 'createdAt',
    header: 'Logged',
    className: 'tabular-nums',
    render: (row) => formatDate(row.createdAt),
  },
];

export const relationshipResourceConfig: ResourceConfig<
  Relationship,
  CreateRelationshipInput,
  UpdateRelationshipInput
> = {
  key: 'relationships',
  labels: { singular: 'Relationship', plural: 'Relationships' },
  columns,
  filters: [
    {
      name: 'interactionType',
      type: 'select',
      placeholder: 'All interaction types',
      options: INTERACTION_TYPES.map((type) => ({ value: type, label: INTERACTION_TYPE_META[type].label })),
    },
  ],
  formFields: [
    { name: 'personName', label: 'Person', type: 'person', required: true },
    {
      name: 'interactionType',
      label: 'Interaction type',
      type: 'select',
      required: true,
      options: INTERACTION_TYPES.map((type) => ({ value: type, label: INTERACTION_TYPE_META[type].label })),
    },
    { name: 'context', label: 'Context', type: 'textarea', placeholder: 'What did you work on together?' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'followUpDate', label: 'Follow-up date', type: 'quick-date' },
    { name: 'followUpDone', label: 'Follow-up done', type: 'boolean', editOnly: true },
  ],
  emptyValues: {
    personName: '',
    interactionType: 'HELPED',
    context: '',
    notes: '',
    followUpDate: '',
  },
  toFormValues: (relationship) => ({
    personName: relationship.personName,
    interactionType: relationship.interactionType,
    context: relationship.context ?? '',
    notes: relationship.notes ?? '',
    followUpDate: relationship.followUpDate ? toDateInputValue(relationship.followUpDate) : '',
    followUpDone: relationship.followUpDone,
  }),
  toCreateInput: (values) => ({
    personName: values.personName as string,
    interactionType: values.interactionType as CreateRelationshipInput['interactionType'],
    context: (values.context as string) || undefined,
    notes: (values.notes as string) || undefined,
    followUpDate: (values.followUpDate as string) || undefined,
  }),
  toUpdateInput: (values) => ({
    personName: values.personName as string,
    interactionType: values.interactionType as UpdateRelationshipInput['interactionType'],
    context: (values.context as string) || undefined,
    notes: (values.notes as string) || undefined,
    followUpDate: (values.followUpDate as string) || undefined,
    followUpDone: Boolean(values.followUpDone),
  }),
};
