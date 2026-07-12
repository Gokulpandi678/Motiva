import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TASK_PRIORITY_META } from '@/config/enums';
import { formatDate } from '@/lib/utils/date';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { taskQueries } from '@/hooks/queries/useTasks';

interface TicketTaskListProps {
  ticketId: string;
}

export function TicketTaskList({ ticketId }: TicketTaskListProps) {
  const toast = useToast();
  const { data, isLoading } = taskQueries.useList({ ticketId, limit: 50 });
  const createMutation = taskQueries.useCreate();
  const updateMutation = taskQueries.useUpdate();
  const [draft, setDraft] = useState('');

  const handleAdd = async () => {
    if (!draft.trim()) return;
    try {
      await createMutation.mutateAsync({
        title: draft.trim(),
        priority: 'MEDIUM',
        status: 'TODO',
        ticketId,
      });
      setDraft('');
    } catch (error) {
      toast.error('Could not add task', error instanceof ApiError ? error.message : undefined);
    }
  };

  const toggleDone = async (id: string, done: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, input: { status: done ? 'DONE' : 'TODO' } });
    } catch (error) {
      toast.error('Could not update task', error instanceof ApiError ? error.message : undefined);
    }
  };

  const tasks = data?.items ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAdd();
          }}
          placeholder="Add a task for this ticket…"
        />
        <Button size="sm" variant="secondary" icon={<Plus className="size-4" />} onClick={handleAdd} disabled={!draft.trim()}>
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks yet" description="Break the fix into steps if it helps." />
      ) : (
        <ul className="space-y-1.5">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 rounded-lg border border-border-hairline p-2.5">
              <input
                type="checkbox"
                checked={task.status === 'DONE'}
                onChange={(event) => toggleDone(task.id, event.target.checked)}
                className="size-4 shrink-0 accent-accent"
              />
              <div className="min-w-0 flex-1">
                <p className={task.status === 'DONE' ? 'truncate text-sm text-ink-muted line-through' : 'truncate text-sm text-ink-primary'}>
                  {task.title}
                </p>
                {task.dueDate ? <p className="text-xs text-ink-muted">Due {formatDate(task.dueDate)}</p> : null}
              </div>
              <Badge tone={TASK_PRIORITY_META[task.priority].tone}>{TASK_PRIORITY_META[task.priority].label}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
