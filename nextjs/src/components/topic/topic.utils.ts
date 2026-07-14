import { differenceInDays } from 'date-fns';
import type { BadgeTone } from '@/components/ui/Badge';

/** Thresholds mirror the Skills "blind spots" convention: recent, aging, stale. */
export function getRecencyTone(lastLoggedAt: string): BadgeTone {
  const days = differenceInDays(new Date(), new Date(lastLoggedAt));
  if (days <= 14) return 'good';
  if (days <= 45) return 'warning';
  return 'critical';
}
