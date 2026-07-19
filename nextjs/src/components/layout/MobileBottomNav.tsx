'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { MOBILE_MORE_NAV_ITEMS, MOBILE_PRIMARY_NAV_ITEMS } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { MobileMoreSheet } from './MobileMoreSheet';

function isNavItemActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

/** Native-app-style bottom tab bar, phones only (hidden md:up, where the sidebar takes over). */
export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MOBILE_MORE_NAV_ITEMS.some((item) => isNavItemActive(pathname, item.to));

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border-hairline bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Primary"
      >
        {MOBILE_PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              className="relative flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active-bar"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-accent-gradient"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <item.icon className={cn('size-5', isActive ? 'text-accent' : 'text-ink-muted')} />
              <span className={isActive ? 'text-accent' : 'text-ink-muted'}>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium"
        >
          {moreActive && (
            <motion.span
              layoutId="mobile-nav-active-bar"
              className="absolute top-0 h-0.5 w-8 rounded-full bg-accent-gradient"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <MoreHorizontal className={cn('size-5', moreActive ? 'text-accent' : 'text-ink-muted')} />
          <span className={moreActive ? 'text-accent' : 'text-ink-muted'}>More</span>
        </button>
      </nav>

      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
