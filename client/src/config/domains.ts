import type { BadgeTone } from '@/components/ui/Badge';

/**
 * Suggestions only — domain is a free-text field so it stays open to whatever
 * you're actually learning, not locked to this list.
 */
export const DOMAIN_SUGGESTIONS = [
  'Technology',
  'Language',
  'Music',
  'Finance',
  'Health & Fitness',
  'Cooking',
  'Personal Development',
  'Business',
  'Other',
] as const;

// Fixed categorical order (never cycled) so a given domain always reads as
// the same color, on every page and every session.
const DOMAIN_TONE_ORDER: BadgeTone[] = ['blue', 'aqua', 'violet', 'orange', 'magenta', 'green', 'yellow', 'red'];

export function getDomainTone(domain: string): BadgeTone {
  const key = domain.toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return DOMAIN_TONE_ORDER[hash % DOMAIN_TONE_ORDER.length] ?? 'neutral';
}
