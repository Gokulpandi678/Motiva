import type { Difficulty, TicketStatus } from '@/types/ticket';
import type { InteractionType } from '@/types/relationship';
import type { TaskPriority, TaskStatus } from '@/types/task';
import type { ActivityType } from '@/types/ticketActivity';
import type { BadgeTone } from '@/components/ui/Badge';

export const DIFFICULTY_META: Record<Difficulty, { label: string; tone: BadgeTone }> = {
  EASY: { label: 'Easy', tone: 'good' },
  MEDIUM: { label: 'Medium', tone: 'warning' },
  HARD: { label: 'Hard', tone: 'critical' },
};

export const INTERACTION_TYPE_META: Record<InteractionType, { label: string; tone: BadgeTone }> = {
  HELPED: { label: 'Helped', tone: 'aqua' },
  PAIRED_WITH: { label: 'Paired with', tone: 'violet' },
  LEARNED_FROM: { label: 'Learned from', tone: 'orange' },
};

export const TICKET_STATUS_META: Record<TicketStatus, { label: string; tone: BadgeTone }> = {
  OPEN: { label: 'Open', tone: 'blue' },
  IN_PROGRESS: { label: 'In Progress', tone: 'warning' },
  RESOLVED: { label: 'Resolved', tone: 'good' },
};

export const TASK_PRIORITY_META: Record<TaskPriority, { label: string; tone: BadgeTone }> = {
  LOW: { label: 'Low', tone: 'neutral' },
  MEDIUM: { label: 'Medium', tone: 'warning' },
  HIGH: { label: 'High', tone: 'critical' },
};

export const TASK_STATUS_META: Record<TaskStatus, { label: string; tone: BadgeTone }> = {
  TODO: { label: 'To Do', tone: 'neutral' },
  IN_PROGRESS: { label: 'In Progress', tone: 'blue' },
  DONE: { label: 'Done', tone: 'good' },
};

export const ACTIVITY_TYPE_META: Record<ActivityType, { label: string; tone: BadgeTone }> = {
  CREATED: { label: 'Created', tone: 'blue' },
  NOTE: { label: 'Note', tone: 'neutral' },
  STATUS_CHANGE: { label: 'Status change', tone: 'violet' },
  CALL: { label: 'Call', tone: 'aqua' },
  EMAIL: { label: 'Email', tone: 'orange' },
  ESCALATION: { label: 'Escalation', tone: 'critical' },
};
