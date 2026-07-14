'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { ResourcePage } from '@/components/resource/ResourcePage';
import { taskQueries, useDueTasks } from '@/hooks/queries/useTasks';
import type { DueTasksQuery, ListTasksQuery, TaskPriority, TaskStatus } from '@/types/task';
import { taskResourceConfig } from './task.resource';

const PAGE_SIZE = 20;

export function TasksPage() {
  const [dueOnly, setDueOnly] = useState(false);

  const headerActions = <Switch checked={dueOnly} onChange={setDueOnly} label="Due only" />;

  if (dueOnly) {
    return (
      <ResourcePage
        config={taskResourceConfig}
        hooks={{
          useList: (query: DueTasksQuery) => useDueTasks(query),
          useUpdate: taskQueries.useUpdate,
          useRemove: taskQueries.useRemove,
        }}
        buildQuery={(_filters, page) => ({ page, limit: PAGE_SIZE })}
        description="Tasks due today or overdue, across everything — standalone and ticket-linked."
        slots={{ headerActions }}
      />
    );
  }

  const buildQuery = (filters: Record<string, string>, page: number): ListTasksQuery => ({
    page,
    limit: PAGE_SIZE,
    status: (filters.status as TaskStatus) || undefined,
    priority: (filters.priority as TaskPriority) || undefined,
  });

  return (
    <ResourcePage
      config={taskResourceConfig}
      hooks={taskQueries}
      buildQuery={buildQuery}
      description="Regular to-dos — standalone, or linked to a ticket from its timeline."
      slots={{ headerActions }}
    />
  );
}
