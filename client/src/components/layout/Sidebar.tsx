import { NavLink } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Sprout } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { sidebarCollapsedAtom } from '@/state/ui';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar-bg bg-sidebar-glow transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="relative flex h-14 items-center gap-2 px-4">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-gradient text-accent-ink shadow-md shadow-accent-glow"
        >
          <Sprout className="size-[18px]" />
        </motion.div>
        {!collapsed && <span className="truncate text-sm font-semibold text-sidebar-ink">Motiva</span>}
      </div>

      <nav className="relative flex-1 space-y-1 px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-sidebar-ink-muted hover:bg-sidebar-surface-hover hover:text-sidebar-ink',
                isActive && 'bg-sidebar-active-gradient text-sidebar-ink shadow-inner',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-gradient"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <item.icon className="size-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="relative flex items-center gap-3 px-4 py-3 text-sm text-sidebar-ink-muted transition-colors hover:text-sidebar-ink"
      >
        {collapsed ? <ChevronsRight className="size-[18px]" /> : <ChevronsLeft className="size-[18px]" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
