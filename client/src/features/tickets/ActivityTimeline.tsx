import { useState } from 'react';
import { AlertTriangle, Mail, MessageSquare, Phone, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ACTIVITY_TYPE_META } from '@/config/enums';
import { formatDate, formatRelative } from '@/lib/utils/date';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { useAddActivity, useRemoveActivity, useTicketActivities } from '@/hooks/queries/useTickets';
import { ACTIVITY_TYPES, type ActivityType } from '@/types/ticketActivity';

const ICONS: Record<ActivityType, typeof MessageSquare> = {
  CREATED: Plus,
  NOTE: MessageSquare,
  STATUS_CHANGE: RefreshCw,
  CALL: Phone,
  EMAIL: Mail,
  ESCALATION: AlertTriangle,
};

const NOTE_TYPE_OPTIONS = ACTIVITY_TYPES.filter((type) => type !== 'CREATED' && type !== 'STATUS_CHANGE').map(
  (type) => ({ value: type, label: ACTIVITY_TYPE_META[type].label }),
);

interface ActivityTimelineProps {
  ticketId: string;
}

export function ActivityTimeline({ ticketId }: ActivityTimelineProps) {
  const toast = useToast();
  const { data: activities, isLoading } = useTicketActivities(ticketId);
  const addActivity = useAddActivity();
  const removeActivity = useRemoveActivity();

  const [type, setType] = useState<ActivityType>('NOTE');
  const [note, setNote] = useState('');

  const handleAdd = async () => {
    if (!note.trim()) return;
    try {
      await addActivity.mutateAsync({ ticketId, input: { type, note: note.trim() } });
      setNote('');
      setType('NOTE');
    } catch (error) {
      toast.error('Could not add activity', error instanceof ApiError ? error.message : undefined);
    }
  };

  const handleRemove = async (activityId: string) => {
    try {
      await removeActivity.mutateAsync({ ticketId, activityId });
    } catch (error) {
      toast.error('Could not remove activity', error instanceof ApiError ? error.message : undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-border-hairline p-3">
        <div className="flex items-center gap-2">
          <Select
            className="w-40"
            options={NOTE_TYPE_OPTIONS}
            value={type}
            onChange={(event) => setType(event.target.value as ActivityType)}
          />
          <span className="text-xs text-ink-muted">Log what's happening</span>
        </div>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What happened?"
          className="min-h-16"
        />
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={handleAdd} isLoading={addActivity.isPending} disabled={!note.trim()}>
            Add to timeline
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : !activities || activities.length === 0 ? (
        <EmptyState title="No activity yet" />
      ) : (
        <ol className="relative space-y-4 border-l border-border-hairline pl-5">
          {activities.map((activity) => {
            const Icon = ICONS[activity.type];
            const meta = ACTIVITY_TYPE_META[activity.type];
            const removable = activity.type !== 'CREATED' && activity.type !== 'STATUS_CHANGE';

            return (
              <li key={activity.id} className="group relative">
                <span className="absolute -left-[27px] top-0.5 flex size-5 items-center justify-center rounded-full border-2 border-surface bg-surface-hover">
                  <Icon className="size-3 text-ink-secondary" />
                </span>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      <span className="text-xs text-ink-muted" title={formatDate(activity.createdAt)}>
                        {formatRelative(activity.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-primary">{activity.note}</p>
                  </div>
                  {removable ? (
                    <IconButton
                      icon={<Trash2 className="size-3.5" />}
                      aria-label="Remove activity"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemove(activity.id)}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
