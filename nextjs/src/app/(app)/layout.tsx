import { RequireAuth } from '@/components/layout/RequireAuth';
import { AppShell } from '@/components/layout/AppShell';

// Equivalent of the old nested routes:
//   <Route element={<RequireAuth />}><Route element={<AppShell />}>...</Route></Route>
// A Next.js route group layout (the `(app)` folder name doesn't appear in
// the URL) applies to every page below it — Dashboard, Tickets, Tasks,
// Learnings, Topics, Skills, Relationships, FAQs, Tags — same as before.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
