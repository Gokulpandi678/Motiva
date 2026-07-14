'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelative } from '@/lib/utils/date';
import { useBlindSpots, useSkillGrowth } from '@/hooks/queries/useSkills';
import type { SkillGrowthEntry } from '@/types/skill';
import { SkillBarChart } from './SkillBarChart';
import { BlindSpotList } from './BlindSpotList';

export function SkillsPage() {
  const { data: growth, isLoading: growthLoading } = useSkillGrowth();
  const { data: blindSpots, isLoading: blindSpotsLoading } = useBlindSpots({ days: 30, limit: 8 });

  const topSkills = (growth ?? []).slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Skill Growth"
        description="Derived automatically from ticket tags and learning tags — no manual skill entry."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-ink-primary">Reps by skill</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Tickets + learnings logged against each tag, all time.</p>
          <div className="mt-4">
            {growthLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : topSkills.length === 0 ? (
              <EmptyState title="No skill activity yet" description="Log a ticket or a learning to see this fill in." />
            ) : (
              <SkillBarChart data={topSkills} />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-medium text-ink-primary">Blind spots</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Tags untouched in the last 30 days.</p>
          <div className="mt-3">
            {blindSpotsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <BlindSpotList entries={blindSpots ?? []} />
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-border-hairline p-4">
          <h2 className="text-sm font-medium text-ink-primary">All skills</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Table view of every tag you've touched.</p>
        </div>
        <Table<SkillGrowthEntry>
          columns={[
            { key: 'tag', header: 'Tag', render: (row) => <span className="font-medium">{row.tag}</span> },
            { key: 'ticketCount', header: 'Tickets', className: 'tabular-nums', render: (row) => row.ticketCount },
            { key: 'learningCount', header: 'Learnings', className: 'tabular-nums', render: (row) => row.learningCount },
            { key: 'totalReps', header: 'Total reps', className: 'tabular-nums', render: (row) => row.totalReps },
            {
              key: 'lastTouchedAt',
              header: 'Last touched',
              render: (row) => (row.lastTouchedAt ? formatRelative(row.lastTouchedAt) : '—'),
            },
          ]}
          rows={growth ?? []}
          rowKey={(row) => row.tag}
          isLoading={growthLoading}
          emptyState={<EmptyState title="Nothing to show yet" />}
        />
      </Card>
    </div>
  );
}
