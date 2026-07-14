'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { ResourcePage } from '@/components/resource/ResourcePage';
import { relationshipQueries, useDueFollowUps } from '@/hooks/queries/useRelationships';
import type { DueFollowUpsQuery, InteractionType, RelationshipListQuery } from '@/types/relationship';
import { relationshipResourceConfig } from './relationship.resource';

const PAGE_SIZE = 20;

export function RelationshipsPage() {
  const [dueOnly, setDueOnly] = useState(false);

  const headerActions = <Switch checked={dueOnly} onChange={setDueOnly} label="Due follow-ups only" />;

  if (dueOnly) {
    return (
      <ResourcePage
        config={relationshipResourceConfig}
        hooks={{
          useList: (query: DueFollowUpsQuery) => useDueFollowUps(query),
          useUpdate: relationshipQueries.useUpdate,
          useRemove: relationshipQueries.useRemove,
        }}
        buildQuery={(_filters, page) => ({ page, limit: PAGE_SIZE })}
        description="Follow-ups that are due or overdue — a nudge before 'we worked together once' fades."
        slots={{ headerActions }}
      />
    );
  }

  const buildQuery = (filters: Record<string, string>, page: number): RelationshipListQuery => ({
    page,
    limit: PAGE_SIZE,
    interactionType: (filters.interactionType as InteractionType) || undefined,
  });

  return (
    <ResourcePage
      config={relationshipResourceConfig}
      hooks={relationshipQueries}
      buildQuery={buildQuery}
      description="Who you helped, paired with, or learned from — with a reminder to keep it going."
      slots={{ headerActions }}
    />
  );
}
