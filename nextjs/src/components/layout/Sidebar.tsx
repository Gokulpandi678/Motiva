'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Sprout } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { sidebarCollapsedAtom } from '@/atoms/ui';
import { cn } from '@/lib/utils/cn';

/** Same "end"-aware matching react-router's <NavLink> did: "/" only matches exactly, every other item matches as a prefix. */
function isNavItemActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        // Hidden on phones — MobileBottomNav takes over navigation there; this is desktop/tablet-only chrome.
        'relative hidden h-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar-bg bg-sidebar-glow transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="relative flex h-14 items-center gap-2 px-4">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-gradient text-accent-ink shadow-md shadow-accent-glow"
        >
          <Sprout className="size-4.5" />
        </motion.div>
        {!collapsed && <span className="truncate text-sm font-semibold text-sidebar-ink">Motiva</span>}
      </div>

      <nav className="relative flex-1 space-y-1 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-sidebar-ink-muted hover:bg-sidebar-surface-hover hover:text-sidebar-ink',
                isActive && 'bg-sidebar-active-gradient text-sidebar-ink shadow-inner',
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-gradient"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <item.icon className="size-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="relative flex items-center gap-3 px-4 py-3 text-sm text-sidebar-ink-muted transition-colors hover:text-sidebar-ink"
      >
        {collapsed ? <ChevronsRight className="size-4.5" /> : <ChevronsLeft className="size-4.5" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
