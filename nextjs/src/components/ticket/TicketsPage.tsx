'use client';

import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { ResourcePage } from '@/components/resource/ResourcePage';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/api/client';
import { ticketQueries, useGenerateFaq } from '@/hooks/queries/useTickets';
import type { Difficulty, Ticket, TicketListQuery, TicketStatus } from '@/types/ticket';
import { ticketResourceConfig } from './ticket.resource';
import { TicketDetailDrawer } from './TicketDetailDrawer';

const PAGE_SIZE = 20;

export function TicketsPage() {
  const toast = useToast();
  const generateFaqMutation = useGenerateFaq();
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  const buildQuery = (filters: Record<string, string>, page: number): TicketListQuery => ({
    page,
    limit: PAGE_SIZE,
    tag: filters.tag || undefined,
    status: (filters.status as TicketStatus) || undefined,
    difficulty: (filters.difficulty as Difficulty) || undefined,
  });

  const handleGenerateFaq = async (ticketId: string) => {
    try {
      await generateFaqMutation.mutateAsync(ticketId);
      toast.success('FAQ generated from ticket');
    } catch (error) {
      toast.error('Could not generate FAQ', error instanceof ApiError ? error.message : undefined);
    }
  };

  return (
    <>
      <ResourcePage
        config={ticketResourceConfig}
        hooks={ticketQueries}
        buildQuery={buildQuery}
        description="Every ticket you're tracking — open, in progress, or resolved — with a timeline of what happened."
        slots={{
          rowActions: (row) => (
            <>
              <IconButton icon={<Eye className="size-4" />} aria-label="View timeline" onClick={() => setViewingTicket(row)} />
              {row.faq ? null : (
                <IconButton
                  icon={<Sparkles className="size-4" />}
                  aria-label="Generate FAQ from this ticket"
                  onClick={() => handleGenerateFaq(row.id)}
                  disabled={generateFaqMutation.isPending && generateFaqMutation.variables === row.id}
                />
              )}
            </>
          ),
        }}
      />
      <TicketDetailDrawer ticket={viewingTicket} onClose={() => setViewingTicket(null)} />
    </>
  );
}
