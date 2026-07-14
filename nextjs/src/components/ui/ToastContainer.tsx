'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useMounted } from '@/hooks/useMounted';
import type { ToastVariant } from '@/atoms/toast';
import { cn } from '@/lib/utils/cn';
import { IconButton } from './IconButton';

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: 'border-l-status-good text-status-good',
  error: 'border-l-status-critical text-status-critical',
  info: 'border-l-accent text-accent',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = VARIANT_ICON[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border border-border-hairline border-l-4 bg-surface p-4 shadow-lg',
                VARIANT_CLASS[toast.variant],
              )}
              role="status"
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-primary">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-0.5 text-sm text-ink-muted">{toast.description}</p>
                ) : null}
              </div>
              <IconButton
                icon={<X className="size-3.5" />}
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="size-6"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
