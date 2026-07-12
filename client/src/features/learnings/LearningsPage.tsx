import { useState } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { ResourcePage } from '@/components/resource/ResourcePage';
import { learningQueries, useLowConfidenceLearnings } from '@/hooks/queries/useLearnings';
import type { LearningListQuery, LowConfidenceQuery } from '@/types/learning';
import { learningResourceConfig } from './learning.resource';

const PAGE_SIZE = 20;
const LOW_CONFIDENCE_THRESHOLD = 3;

export function LearningsPage() {
  const [lowConfidenceOnly, setLowConfidenceOnly] = useState(false);

  const headerActions = (
    <>
      <Switch checked={lowConfidenceOnly} onChange={setLowConfidenceOnly} label="Low confidence only" />
      <Link
        to="/topics"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-hairline bg-surface px-4 text-sm font-medium text-ink-primary hover:bg-surface-hover"
      >
        <History className="size-4" />
        By topic
      </Link>
    </>
  );

  if (lowConfidenceOnly) {
    return (
      <ResourcePage
        config={learningResourceConfig}
        hooks={{
          useList: (query: LowConfidenceQuery) => useLowConfidenceLearnings(query),
          useUpdate: learningQueries.useUpdate,
          useRemove: learningQueries.useRemove,
        }}
        buildQuery={(_filters, page) => ({ page, limit: PAGE_SIZE, threshold: LOW_CONFIDENCE_THRESHOLD })}
        description="Learnings you rated 3 or below — revisit these before the details fade."
        slots={{ headerActions }}
      />
    );
  }

  const buildQuery = (filters: Record<string, string>, page: number): LearningListQuery => ({
    page,
    limit: PAGE_SIZE,
    tag: filters.tag || undefined,
    domain: filters.domain || undefined,
  });

  return (
    <ResourcePage
      config={learningResourceConfig}
      hooks={learningQueries}
      buildQuery={buildQuery}
      description="Courses, docs, and things colleagues showed you — tracked outside of tickets."
      slots={{ headerActions }}
    />
  );
}
