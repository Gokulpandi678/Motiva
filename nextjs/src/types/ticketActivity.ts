export const ACTIVITY_TYPES = ['CREATED', 'NOTE', 'STATUS_CHANGE', 'CALL', 'EMAIL', 'ESCALATION'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface TicketActivity {
  id: string;
  ticketId: string;
  type: ActivityType;
  note: string;
  createdAt: string;
}

export interface CreateActivityInput {
  type: ActivityType;
  note: string;
}
