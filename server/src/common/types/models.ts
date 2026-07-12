import type { ActivityType, Difficulty, InteractionType, TaskPriority, TaskStatus, TicketStatus } from '../enums';

/** Plain row shapes mirroring exactly what Prisma used to generate from schema.prisma. */

export interface User {
  id: string;
  workosUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  profilePictureUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  problem: string;
  resolution: string | null;
  status: TicketStatus;
  difficulty: Difficulty;
  timeSpentMinutes: number;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faq {
  id: string;
  userId: string;
  question: string;
  answer: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketActivity {
  id: string;
  userId: string;
  ticketId: string;
  type: ActivityType;
  note: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  ticketId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Learning {
  id: string;
  userId: string;
  title: string;
  domain: string;
  source: string | null;
  notes: string | null;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Relationship {
  id: string;
  userId: string;
  personName: string;
  interactionType: InteractionType;
  context: string | null;
  notes: string | null;
  followUpDate: Date | null;
  followUpDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}
