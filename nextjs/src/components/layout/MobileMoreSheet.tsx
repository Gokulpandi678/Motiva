'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { MOBILE_MORE_NAV_ITEMS } from '@/config/navigation';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils/cn';

interface MobileMoreSheetProps {
  open: boolean;
  onClose: () => void;
}

function isNavItemActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

/**
 * Bottom sheet for the nav sections that don't fit as their own bottom-bar
 * tab (Relationships, Skills, Topics, FAQs, Tags & Domains). Mirrors the
 * slide-up/backdrop pattern of the shared `Drawer`/`Modal` components
 * without touching them — those slide in from the side and are used by
 * existing desktop detail views, this is mobile-nav-specific.
 */
export function MobileMoreSheet({ open, onClose }: MobileMoreSheetProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="More sections"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border-hairline bg-surface pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-ink-primary">More</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-hover hover:text-ink-primary"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="grid grid-cols-3 gap-2 px-4 pb-4">
              {MOBILE_MORE_NAV_ITEMS.map((item) => {
                const isActive = isNavItemActive(pathname, item.to);
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={onClose}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-accent-soft text-accent'
                        : 'text-ink-secondary hover:bg-surface-hover hover:text-ink-primary',
                    )}
                  >
                    <item.icon className="size-5" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
