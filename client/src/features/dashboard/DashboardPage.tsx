import { BookOpen, CheckSquare, Sparkles, Ticket as TicketIcon, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { INTERACTION_TYPE_META, TASK_PRIORITY_META, TICKET_STATUS_META } from '@/config/enums';
import { formatDate, formatRelative } from '@/lib/utils/date';
import { ticketQueries } from '@/hooks/queries/useTickets';
import { useLowConfidenceLearnings } from '@/hooks/queries/useLearnings';
import { useDueFollowUps } from '@/hooks/queries/useRelationships';
import { useDueTasks } from '@/hooks/queries/useTasks';
import { useSkillGrowth } from '@/hooks/queries/useSkills';
import { ActivityListCard } from './ActivityListCard';

const RECENT_LIMIT = 5;

export function DashboardPage() {
  const { data: recentTickets, isLoading: ticketsLoading } = ticketQueries.useList({ page: 1, limit: RECENT_LIMIT });
  const { data: lowConfidence, isLoading: lowConfidenceLoading } = useLowConfidenceLearnings({
    page: 1,
    limit: 1,
    threshold: 3,
  });
  const { data: dueFollowUps, isLoading: dueLoading } = useDueFollowUps({ page: 1, limit: RECENT_LIMIT });
  const { data: dueTasks, isLoading: dueTasksLoading } = useDueTasks({ page: 1, limit: RECENT_LIMIT });
  const { data: skillGrowth, isLoading: skillsLoading } = useSkillGrowth();

  const topSkill = skillGrowth?.[0];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Dashboard" description="Your growth trail, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Tickets logged"
          value={recentTickets?.meta.total ?? 0}
          icon={<TicketIcon className="size-[18px]" />}
          isLoading={ticketsLoading}
          tone="aqua"
        />
        <StatCard
          label="Tasks due"
          value={dueTasks?.meta.total ?? 0}
          icon={<CheckSquare className="size-[18px]" />}
          isLoading={dueTasksLoading}
          tone={dueTasks && dueTasks.meta.total > 0 ? 'critical' : 'good'}
        />
        <StatCard
          label="Learnings to revisit"
          value={lowConfidence?.meta.total ?? 0}
          icon={<BookOpen className="size-[18px]" />}
          isLoading={lowConfidenceLoading}
          tone="warning"
        />
        <StatCard
          label="Follow-ups due"
          value={dueFollowUps?.meta.total ?? 0}
          icon={<Users className="size-[18px]" />}
          isLoading={dueLoading}
          tone={dueFollowUps && dueFollowUps.meta.total > 0 ? 'critical' : 'good'}
        />
        <StatCard
          label="Top skill"
          value={topSkill?.tag ?? '—'}
          hint={topSkill ? `${topSkill.totalReps} reps` : undefined}
          icon={<Sparkles className="size-[18px]" />}
          isLoading={skillsLoading}
          tone="violet"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityListCard
          title="Recent tickets"
          viewAllTo="/tickets"
          isLoading={ticketsLoading}
          items={recentTickets?.items}
          rowKey={(ticket) => ticket.id}
          renderPrimary={(ticket) => ticket.title}
          renderSecondary={(ticket) => formatDate(ticket.createdAt)}
          renderBadge={(ticket) => (
            <Badge tone={TICKET_STATUS_META[ticket.status].tone}>{TICKET_STATUS_META[ticket.status].label}</Badge>
          )}
          emptyTitle="No tickets logged yet"
        />

        <ActivityListCard
          title="Tasks due"
          viewAllTo="/tasks"
          isLoading={dueTasksLoading}
          items={dueTasks?.items}
          rowKey={(task) => task.id}
          renderPrimary={(task) => task.title}
          renderSecondary={(task) => (task.dueDate ? `Due ${formatRelative(task.dueDate)}` : '')}
          renderBadge={(task) => (
            <Badge tone={TASK_PRIORITY_META[task.priority].tone}>{TASK_PRIORITY_META[task.priority].label}</Badge>
          )}
          emptyTitle="Nothing due"
          emptyDescription="You're all caught up on tasks."
        />

        <ActivityListCard
          title="Follow-ups due"
          viewAllTo="/relationships"
          isLoading={dueLoading}
          items={dueFollowUps?.items}
          rowKey={(relationship) => relationship.id}
          renderPrimary={(relationship) => relationship.personName}
          renderSecondary={(relationship) =>
            relationship.followUpDate ? `Due ${formatRelative(relationship.followUpDate)}` : ''
          }
          renderBadge={(relationship) => (
            <Badge tone={INTERACTION_TYPE_META[relationship.interactionType].tone}>
              {INTERACTION_TYPE_META[relationship.interactionType].label}
            </Badge>
          )}
          emptyTitle="Nothing due"
          emptyDescription="You're all caught up on follow-ups."
        />
      </div>
    </div>
  );
}
