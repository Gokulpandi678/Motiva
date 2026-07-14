import { Badge } from '@/components/ui/Badge';
import type { TableColumn } from '@/components/ui/Table';
import type { ResourceConfig } from '@/components/resource/types';
import { TASK_PRIORITY_META, TASK_STATUS_META } from '@/config/enums';
import { formatDate, isOverdue } from '@/lib/utils/date';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type UpdateTaskInput,
} from '@/types/task';

const columns: TableColumn<Task>[] = [
  {
    key: 'title',
    header: 'Task',
    className: 'max-w-72',
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-primary">{row.title}</p>
        {row.description ? <p className="truncate text-xs text-ink-muted">{row.description}</p> : null}
      </div>
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row) => <Badge tone={TASK_PRIORITY_META[row.priority].tone}>{TASK_PRIORITY_META[row.priority].label}</Badge>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge tone={TASK_STATUS_META[row.status].tone}>{TASK_STATUS_META[row.status].label}</Badge>,
  },
  {
    key: 'dueDate',
    header: 'Due',
    render: (row) => {
      if (!row.dueDate) return <span className="text-ink-muted">—</span>;
      const overdue = row.status !== 'DONE' && isOverdue(row.dueDate);
      return <Badge tone={overdue ? 'critical' : 'neutral'}>{formatDate(row.dueDate)}</Badge>;
    },
  },
  {
    key: 'ticketId',
    header: 'Linked',
    render: (row) => (row.ticketId ? <Badge tone="blue">Ticket</Badge> : <span className="text-ink-muted">—</span>),
  },
];

export const taskResourceConfig: ResourceConfig<Task, CreateTaskInput, UpdateTaskInput> = {
  key: 'tasks',
  labels: { singular: 'Task', plural: 'Tasks' },
  columns,
  filters: [
    {
      name: 'status',
      type: 'select',
      placeholder: 'All statuses',
      options: TASK_STATUSES.map((status) => ({ value: status, label: TASK_STATUS_META[status].label })),
    },
    {
      name: 'priority',
      type: 'select',
      placeholder: 'All priorities',
      options: TASK_PRIORITIES.map((priority) => ({ value: priority, label: TASK_PRIORITY_META[priority].label })),
    },
  ],
  formFields: [
    { name: 'title', label: 'Task', type: 'text', required: true, placeholder: 'What needs doing?' },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'priority',
      label: 'Priority',
      type: 'segmented',
      required: true,
      options: TASK_PRIORITIES.map((priority) => ({
        value: priority,
        label: TASK_PRIORITY_META[priority].label,
        tone: TASK_PRIORITY_META[priority].tone,
      })),
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: TASK_STATUSES.map((status) => ({ value: status, label: TASK_STATUS_META[status].label })),
    },
    { name: 'dueDate', label: 'Due date', type: 'quick-date' },
  ],
  emptyValues: { title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' },
  toFormValues: (task) => ({
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  }),
  toCreateInput: (values) => ({
    title: values.title as string,
    description: (values.description as string) || undefined,
    priority: values.priority as CreateTaskInput['priority'],
    status: values.status as CreateTaskInput['status'],
    dueDate: (values.dueDate as string) || undefined,
  }),
  toUpdateInput: (values) => ({
    title: values.title as string,
    description: (values.description as string) || undefined,
    priority: values.priority as UpdateTaskInput['priority'],
    status: values.status as UpdateTaskInput['status'],
    dueDate: (values.dueDate as string) || undefined,
  }),
};
