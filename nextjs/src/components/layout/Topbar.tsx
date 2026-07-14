'use client';

import { LogOut, Moon, Sun, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/config/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useCurrentUser, useLogout } from '@/hooks/queries/useAuth';
import { IconButton } from '@/components/ui/IconButton';
import { quickCaptureOpenAtom } from '@/atoms/quickCapture';

export function Topbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const setQuickCaptureOpen = useSetAtom(quickCaptureOpenAtom);
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const current = NAV_ITEMS.find((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)));
  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : '';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-hairline bg-surface px-6">
      <div className="flex items-center gap-2">
        {current ? <current.icon className="size-4 text-accent" /> : null}
        <h1 className="text-sm font-semibold text-ink-secondary">{current?.label ?? 'Motiva'}</h1>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setQuickCaptureOpen(true)}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-accent-gradient px-3 text-xs font-semibold text-accent-ink shadow-sm shadow-accent-glow hover:brightness-110"
        >
          <Zap className="size-3.5" />
          Quick capture
          <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
        </motion.button>
        <IconButton
          icon={
            theme === 'dark' ? (
              <Sun className="size-4 text-cat-yellow" />
            ) : (
              <Moon className="size-4 text-cat-violet" />
            )
          }
          aria-label="Toggle color theme"
          onClick={toggle}
        />
        {user ? (
          <div className="ml-1 flex items-center gap-2 border-l border-border-hairline pl-3">
            <span className="hidden text-xs font-medium text-ink-secondary sm:inline" title={user.email}>
              {displayName}
            </span>
            <IconButton
              icon={<LogOut className="size-4" />}
              aria-label="Sign out"
              onClick={() => logoutMutation.mutate()}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
