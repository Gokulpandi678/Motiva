/**
 * Mirrors the Postgres enum types created in the database (see prisma/migrations
 * for the historical `CREATE TYPE` statements — those enum types still live in
 * the DB; this file is just the app-side mirror of them now that Prisma no
 * longer generates it for us).
 *
 * Deliberately a const object + derived union type (not a native TS `enum`) —
 * this is what Prisma's own generated enums looked like structurally, and it
 * means a plain string literal like `'CREATED'` remains assignable wherever
 * the type is expected, matching every existing call site in this codebase.
 */

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const InteractionType = {
  HELPED: 'HELPED',
  PAIRED_WITH: 'PAIRED_WITH',
  LEARNED_FROM: 'LEARNED_FROM',
} as const;
export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType];

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const ActivityType = {
  CREATED: 'CREATED',
  NOTE: 'NOTE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  ESCALATION: 'ESCALATION',
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
