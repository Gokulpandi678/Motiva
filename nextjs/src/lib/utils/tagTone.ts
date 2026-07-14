import type { BadgeTone } from '@/components/ui/Badge';

const TAG_TONES: BadgeTone[] = ['blue', 'aqua', 'violet', 'green', 'orange', 'magenta', 'yellow', 'red'];

export function tagTone(name: string): BadgeTone {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return TAG_TONES[Math.abs(hash) % TAG_TONES.length];
}

/** Literal class map so Tailwind's static scanner can see every class name. */
const DOT_CLASS: Record<BadgeTone, string> = {
  neutral: 'bg-ink-muted',
  good: 'bg-status-good',
  warning: 'bg-status-warning',
  serious: 'bg-status-serious',
  critical: 'bg-status-critical',
  blue: 'bg-cat-blue',
  aqua: 'bg-cat-aqua',
  yellow: 'bg-cat-yellow',
  green: 'bg-cat-green',
  violet: 'bg-cat-violet',
  red: 'bg-cat-red',
  magenta: 'bg-cat-magenta',
  orange: 'bg-cat-orange',
};

export function tagToneDotClass(name: string): string {
  return DOT_CLASS[tagTone(name)];
}
