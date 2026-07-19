'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { QuickCaptureModal } from '@/components/quick-capture/QuickCaptureModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-surface-page">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {/* pb-20 clears the fixed mobile bottom nav (~4.75rem incl. safe-area); md:pb-6 restores normal padding once the sidebar takes over. */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-20 sm:px-6 md:pb-6">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <ToastContainer />
      <QuickCaptureModal />
      <MobileBottomNav />
    </div>
  );
}
