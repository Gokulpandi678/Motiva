'use client';

import { type KeyboardEvent, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { GraduationCap, Ticket, Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResourceFormDrawer } from '@/components/resource/ResourceFormDrawer';
import { quickCaptureOpenAtom } from '@/atoms/quickCapture';
import { ticketQueries } from '@/hooks/queries/useTickets';
import { learningQueries } from '@/hooks/queries/useLearnings';
import { relationshipQueries } from '@/hooks/queries/useRelationships';
import { ticketResourceConfig } from '@/components/ticket/ticket.resource';
import { learningResourceConfig } from '@/components/learning/learning.resource';
import { relationshipResourceConfig } from '@/components/relationship/relationship.resource';
import type { FormValues } from '@/components/resource/types';
import { parseQuickCapture, type QuickCaptureResult } from './parseQuickCapture';

const TYPE_META = {
  ticket: { label: 'Ticket', icon: Ticket, tone: 'blue' as const },
  learning: { label: 'Learning', icon: GraduationCap, tone: 'violet' as const },
  relationship: { label: 'Relationship', icon: Users, tone: 'aqua' as const },
};

export function QuickCaptureModal() {
  const [open, setOpen] = useAtom(quickCaptureOpenAtom);
  const [line, setLine] = useState('');
  const [pending, setPending] = useState<QuickCaptureResult | null>(null);

  useEffect(() => {
    function handleGlobalShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', handleGlobalShortcut);
    return () => document.removeEventListener('keydown', handleGlobalShortcut);
  }, [setOpen]);

  const parsed: QuickCaptureResult = line.trim() ? parseQuickCapture(line) : { type: null };

  const commit = () => {
    if (parsed.type === null) return;
    setPending(parsed);
    setOpen(false);
    setLine('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Quick capture"
        footer={
          <Button variant="primary" onClick={commit} disabled={parsed.type === null}>
            Continue
          </Button>
        }
      >
        <div className="space-y-3">
          <Input
            autoFocus
            value={line}
            onChange={(event) => setLine(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="resolved: … / learned: … / met: …"
          />
          {line.trim() && parsed.type ? (
            <Badge tone={TYPE_META[parsed.type].tone}>Will open a new {TYPE_META[parsed.type].label} form</Badge>
          ) : line.trim() ? (
            <p className="text-xs text-ink-muted">
              Start with <span className="font-medium">resolved:</span>, <span className="font-medium">learned:</span>,
              or <span className="font-medium">met:</span>
            </p>
          ) : (
            <div className="space-y-1 text-xs text-ink-muted">
              <p>
                <span className="font-medium text-ink-secondary">resolved:</span> title, resolution #tag1 #tag2
              </p>
              <p>
                <span className="font-medium text-ink-secondary">learned:</span> title, from source #tag
              </p>
              <p>
                <span className="font-medium text-ink-secondary">met:</span> person, context, follow up friday
              </p>
            </div>
          )}
        </div>
      </Modal>

      {pending?.type === 'ticket' ? (
        <ResourceFormDrawer
          open
          mode="create"
          config={ticketResourceConfig}
          hooks={ticketQueries}
          onClose={() => setPending(null)}
          initialValuesOverride={pending.values as unknown as FormValues}
        />
      ) : null}

      {pending?.type === 'learning' ? (
        <ResourceFormDrawer
          open
          mode="create"
          config={learningResourceConfig}
          hooks={learningQueries}
          onClose={() => setPending(null)}
          initialValuesOverride={pending.values as unknown as FormValues}
        />
      ) : null}

      {pending?.type === 'relationship' ? (
        <ResourceFormDrawer
          open
          mode="create"
          config={relationshipResourceConfig}
          hooks={relationshipQueries}
          onClose={() => setPending(null)}
          initialValuesOverride={pending.values as unknown as FormValues}
        />
      ) : null}
    </>
  );
}
