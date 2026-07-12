import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { TagList } from '@/components/ui/TagList';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { DIFFICULTY_META, TICKET_STATUS_META } from '@/config/enums';
import { formatDate } from '@/lib/utils/date';
import { formatDuration } from '@/lib/utils/duration';
import { ticketQueries } from '@/hooks/queries/useTickets';
import { TICKET_STATUSES, type Ticket, type TicketStatus } from '@/types/ticket';
import { ActivityTimeline } from './ActivityTimeline';
import { TicketTaskList } from './TicketTaskList';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDetailDrawer({ ticket, onClose }: TicketDetailDrawerProps) {
  const toast = useToast();
  const updateMutation = ticketQueries.useUpdate();

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return;
    try {
      await updateMutation.mutateAsync({ id: ticket.id, input: { status } });
    } catch (error) {
      toast.error('Could not change status', error instanceof ApiError ? error.message : undefined);
    }
  };

  return (
    <Drawer open={Boolean(ticket)} onClose={onClose} title={ticket?.title ?? ''} size="lg">
      {ticket ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              className="w-40"
              options={TICKET_STATUSES.map((status) => ({ value: status, label: TICKET_STATUS_META[status].label }))}
              value={ticket.status}
              onChange={(event) => handleStatusChange(event.target.value as TicketStatus)}
            />
            <Badge tone={DIFFICULTY_META[ticket.difficulty].tone}>{DIFFICULTY_META[ticket.difficulty].label}</Badge>
            <span className="text-xs text-ink-muted">
              Logged {formatDate(ticket.createdAt)} · {formatDuration(ticket.timeSpentMinutes)} spent
              {ticket.resolvedAt ? ` · Resolved ${formatDate(ticket.resolvedAt)}` : ''}
            </span>
          </div>

          <TagList tags={ticket.tags.map((tag) => tag.name)} />

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-muted">What was wrong</h3>
              <p className="mt-1 text-sm text-ink-primary">{ticket.problem}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-muted">What fixed it</h3>
              <p className="mt-1 text-sm text-ink-primary">
                {ticket.resolution || <span className="text-ink-muted">Not resolved yet</span>}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-ink-primary">Tasks</h3>
            <TicketTaskList ticketId={ticket.id} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-ink-primary">Timeline</h3>
            <ActivityTimeline ticketId={ticket.id} />
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
