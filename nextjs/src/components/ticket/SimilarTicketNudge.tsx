'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRelative } from '@/lib/utils/date';
import { useSimilarTickets } from '@/hooks/queries/useTickets';
import type { FormValues } from '@/components/resource/types';

const MIN_SIMILARITY = 0.35;

interface SimilarTicketNudgeProps {
  values: FormValues;
  setValue: (name: string, value: unknown) => void;
}

/** Tickets often repeat — this lets you inherit tags/difficulty from a near-identical past one instead of retyping them. */
export function SimilarTicketNudge({ values, setValue }: SimilarTicketNudgeProps) {
  const title = (values.title as string) ?? '';
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const { data: matches } = useSimilarTickets({ title, limit: 1 });

  const top = matches?.[0];
  if (!top || top.similarity < MIN_SIMILARITY || dismissedFor === title) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border-hairline bg-accent-soft p-3">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
      <div className="flex-1">
        <p className="text-sm text-ink-primary">
          Similar: "<span className="font-medium">{top.ticket.title}</span>" (resolved{' '}
          {formatRelative(top.ticket.createdAt)})
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setValue('tags', top.ticket.tags.map((tag) => tag.name));
              setValue('difficulty', top.ticket.difficulty);
              setDismissedFor(title);
            }}
          >
            Copy tags &amp; difficulty
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDismissedFor(title)}>
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
