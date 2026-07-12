import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Spinner } from '@/components/ui/Spinner';
import { LoginPage } from '@/features/auth/LoginPage';
import { AuthCallbackPage } from '@/features/auth/AuthCallbackPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { TicketsPage } from '@/features/tickets/TicketsPage';
import { TasksPage } from '@/features/tasks/TasksPage';
import { FaqsPage } from '@/features/faqs/FaqsPage';
import { LearningsPage } from '@/features/learnings/LearningsPage';
import { TopicsPage } from '@/features/topics/TopicsPage';
import { RelationshipsPage } from '@/features/relationships/RelationshipsPage';
import { TagsPage } from '@/features/tags/TagsPage';

// Recharts is the single biggest dependency in the bundle — keep it out of the
// main chunk by only loading the Skills page (and recharts with it) on demand.
const SkillsPage = lazy(() => import('@/features/skills/SkillsPage').then((m) => ({ default: m.SkillsPage })));

function PageFallback() {
  return (
    <div className="flex justify-center py-24">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="learnings" element={<LearningsPage />} />
              <Route path="topics" element={<TopicsPage />} />
              <Route
                path="skills"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <SkillsPage />
                  </Suspense>
                }
              />
              <Route path="relationships" element={<RelationshipsPage />} />
              <Route path="tags" element={<TagsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
