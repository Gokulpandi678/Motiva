import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table } from '@/components/ui/Table';
import { getDomainTone } from '@/config/domains';
import { formatDate, formatRelative } from '@/lib/utils/date';
import { useTopics } from '@/hooks/queries/useLearnings';
import type { TopicSummary } from '@/types/topic';
import { getRecencyTone } from './topic.utils';
import { TopicTimelineDrawer } from './TopicTimelineDrawer';

export function TopicsPage() {
  const { data: topics, isLoading } = useTopics({});
  const [domainFilter, setDomainFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const domainOptions = useMemo(() => {
    const domains = new Set<string>();
    for (const topic of topics ?? []) {
      for (const domain of topic.domains) domains.add(domain);
    }
    return Array.from(domains)
      .sort((a, b) => a.localeCompare(b))
      .map((domain) => ({ value: domain, label: domain }));
  }, [topics]);

  const visibleTopics = useMemo(() => {
    if (!domainFilter) return topics ?? [];
    return (topics ?? []).filter((topic) => topic.domains.includes(domainFilter));
  }, [topics, domainFilter]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Topics"
        description="Every topic you've logged a learning against, tech or not — ranked by how long since you last touched it."
        actions={
          domainOptions.length > 0 ? (
            <Select
              className="w-48"
              placeholder="All domains"
              options={domainOptions}
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
            />
          ) : undefined
        }
      />

      <Card>
        <Table<TopicSummary>
          columns={[
            {
              key: 'tag',
              header: 'Topic',
              render: (row) => <span className="font-medium">{row.tag}</span>,
            },
            {
              key: 'domains',
              header: 'Domain',
              render: (row) => (
                <div className="flex flex-wrap gap-1">
                  {row.domains.map((domain) => (
                    <Badge key={domain} tone={getDomainTone(domain)}>
                      {domain}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              key: 'entryCount',
              header: 'Logs',
              className: 'tabular-nums',
              render: (row) => row.entryCount,
            },
            {
              key: 'latestConfidence',
              header: 'Latest confidence',
              render: (row) => <RatingStars value={row.latestConfidence} />,
            },
            {
              key: 'lastLoggedAt',
              header: 'Last touched',
              render: (row) => (
                <Badge tone={getRecencyTone(row.lastLoggedAt)} title={formatDate(row.lastLoggedAt)}>
                  {formatRelative(row.lastLoggedAt)}
                </Badge>
              ),
            },
          ]}
          rows={visibleTopics}
          rowKey={(row) => row.tag}
          isLoading={isLoading}
          onRowClick={(row) => setSelectedTag(row.tag)}
          emptyState={
            <EmptyState
              title="No topics yet"
              description="Log a learning with at least one tag to see it show up here."
            />
          }
        />
      </Card>

      <TopicTimelineDrawer tag={selectedTag} onClose={() => setSelectedTag(null)} />
    </div>
  );
}
