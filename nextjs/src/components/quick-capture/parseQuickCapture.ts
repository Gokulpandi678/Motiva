import { addDays, addWeeks, format, nextDay, type Day } from 'date-fns';
import type { InteractionType } from '@/types/relationship';

const WEEKDAYS: Record<string, Day> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export interface TicketCapture {
  title: string;
  problem: string;
  resolution: string;
  tags: string[];
}

export interface LearningCapture {
  title: string;
  source?: string;
  notes?: string;
  tags: string[];
}

export interface RelationshipCapture {
  personName: string;
  interactionType: InteractionType;
  context?: string;
  followUpDate?: string;
}

export type QuickCaptureResult =
  | { type: 'ticket'; values: TicketCapture }
  | { type: 'learning'; values: LearningCapture }
  | { type: 'relationship'; values: RelationshipCapture }
  | { type: null };

function extractTags(text: string): { tags: string[]; rest: string } {
  const tags: string[] = [];
  const rest = text.replace(/#([\w-]+)/g, (_match, tag: string) => {
    tags.push(tag.toLowerCase());
    return '';
  });
  return { tags, rest: rest.replace(/\s{2,}/g, ' ').trim() };
}

function resolveDatePhrase(phrase: string): string | undefined {
  const normalized = phrase.trim().toLowerCase();
  const today = new Date();

  if (normalized === 'today') return format(today, 'yyyy-MM-dd');
  if (normalized === 'tomorrow') return format(addDays(today, 1), 'yyyy-MM-dd');
  if (normalized === 'next week') return format(addWeeks(today, 1), 'yyyy-MM-dd');

  if (normalized in WEEKDAYS) {
    return format(nextDay(today, WEEKDAYS[normalized] as Day), 'yyyy-MM-dd');
  }

  const relativeDays = normalized.match(/^\+?(\d+)\s*days?$/);
  if (relativeDays) return format(addDays(today, Number(relativeDays[1])), 'yyyy-MM-dd');

  const relativeWeeks = normalized.match(/^\+?(\d+)\s*weeks?$/);
  if (relativeWeeks) return format(addWeeks(today, Number(relativeWeeks[1])), 'yyyy-MM-dd');

  return undefined;
}

function extractFollowUp(text: string): { followUpDate?: string; rest: string } {
  const match = text.match(/follow[\s-]?up\s+(.+)$/i);
  if (!match) return { rest: text };

  const followUpDate = resolveDatePhrase(match[1] ?? '');
  const rest = text
    .slice(0, match.index)
    .trim()
    .replace(/,\s*$/, '');
  return { followUpDate, rest };
}

function splitFirstComma(text: string): [string, string] {
  const index = text.indexOf(',');
  if (index === -1) return [text.trim(), ''];
  return [text.slice(0, index).trim(), text.slice(index + 1).trim()];
}

function inferInteractionType(text: string): InteractionType {
  const normalized = text.toLowerCase();
  if (normalized.includes('pair')) return 'PAIRED_WITH';
  if (normalized.includes('learn')) return 'LEARNED_FROM';
  return 'HELPED';
}

/**
 * Turns one typed line into a prefilled-form draft — never auto-saves. Keeps
 * capture to a single line for the common case, while still landing in the
 * normal form so anything the parser guesses wrong is easy to fix before saving.
 */
export function parseQuickCapture(line: string): QuickCaptureResult {
  const match = line.match(/^\s*(resolved|learned|met)\s*:\s*(.*)$/i);
  if (!match) return { type: null };

  const verb = match[1]?.toLowerCase();
  const body = match[2] ?? '';

  if (verb === 'resolved') {
    const { tags, rest } = extractTags(body);
    const [title, resolution] = splitFirstComma(rest);
    return {
      type: 'ticket',
      values: { title, problem: title, resolution, tags },
    };
  }

  if (verb === 'learned') {
    const { tags, rest } = extractTags(body);
    const [title, remainder] = splitFirstComma(rest);
    const fromMatch = remainder.match(/^from\s+(.+)$/i);
    return {
      type: 'learning',
      values: {
        title,
        source: fromMatch ? fromMatch[1]?.trim() : undefined,
        notes: fromMatch ? undefined : remainder || undefined,
        tags,
      },
    };
  }

  // met:
  const { followUpDate, rest: withoutFollowUp } = extractFollowUp(body);
  const [personName, context] = splitFirstComma(withoutFollowUp);
  return {
    type: 'relationship',
    values: {
      personName,
      interactionType: inferInteractionType(context),
      context: context || undefined,
      followUpDate,
    },
  };
}
