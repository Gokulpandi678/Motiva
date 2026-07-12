import { BarChart3, CheckSquare, LayoutDashboard, Ticket as TicketIcon } from 'lucide-react';

const NAV_DOTS = [LayoutDashboard, TicketIcon, CheckSquare, BarChart3];

const RECENT: { title: string; tone: 'good' | 'warning' | 'blue'; label: string }[] = [
  { title: 'Db hits which causes rate limit', tone: 'good', label: 'Resolved' },
  { title: 'NSE chart data not loaded', tone: 'blue', label: 'In progress' },
  { title: 'Cache invalidation on deploy', tone: 'warning', label: 'Open' },
];

const DOT_TONE: Record<(typeof RECENT)[number]['tone'], string> = {
  good: 'bg-status-good',
  warning: 'bg-status-warning',
  blue: 'bg-cat-blue',
};

/** Purely decorative, static recreation of the real dashboard's layout/tokens — not the live interactive page. */
export function DashboardMockup() {
  return (
    <div
      role="img"
      aria-label="Preview of the Motiva dashboard"
      className="flex h-full w-full overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-bg text-[11px]"
    >
      <div className="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-sidebar-border py-4">
        <div className="flex size-6 items-center justify-center rounded-md bg-accent-gradient" />
        {NAV_DOTS.map((Icon, index) => (
          <div
            key={index}
            className={
              index === 0
                ? 'flex size-6 items-center justify-center rounded-md bg-sidebar-active-gradient text-sidebar-ink'
                : 'flex size-6 items-center justify-center rounded-md text-sidebar-ink-muted'
            }
          >
            <Icon className="size-3.5" />
          </div>
        ))}
      </div>

      <div className="flex-1 bg-surface p-3.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-ink-primary">Dashboard</span>
          <span className="rounded-md bg-accent-gradient px-2 py-1 text-[10px] font-semibold text-accent-ink">
            Quick capture
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border-hairline bg-surface-page p-2">
            <p className="text-ink-muted">Tickets</p>
            <p className="mt-1 text-base font-bold text-ink-primary">24</p>
          </div>
          <div className="rounded-lg border border-border-hairline bg-surface-page p-2">
            <p className="text-ink-muted">Tasks due</p>
            <p className="mt-1 text-base font-bold text-status-critical">3</p>
          </div>
          <div className="rounded-lg border border-border-hairline bg-surface-page p-2">
            <p className="text-ink-muted">Top skill</p>
            <p className="mt-1 text-base font-bold text-cat-violet">redis</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-border-hairline">
          <p className="border-b border-border-hairline px-2.5 py-1.5 font-medium text-ink-primary">Recent tickets</p>
          <ul>
            {RECENT.map((row) => (
              <li key={row.title} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                <span className="truncate text-ink-secondary">{row.title}</span>
                <span className="flex shrink-0 items-center gap-1 text-ink-muted">
                  <span className={`size-1.5 rounded-full ${DOT_TONE[row.tone]}`} />
                  {row.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
