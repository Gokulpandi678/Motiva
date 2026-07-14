'use client';

import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useMounted } from '@/hooks/useMounted';
import { IconButton } from './IconButton';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** 'lg' is for richer detail views (e.g. a ticket's timeline + tasks); defaults to 'md'. */
  size?: 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<DrawerProps['size']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export function Drawer({ open, onClose, title, description, children, footer, size = 'md' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'relative flex h-full w-full flex-col border-l-4 border-accent bg-surface shadow-2xl',
              SIZE_CLASSES[size],
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-hairline px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-ink-primary">{title}</h2>
                {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
              </div>
              <IconButton icon={<X className="size-4" />} aria-label="Close" onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer ? (
              <div className="flex items-center justify-end gap-2 border-t border-border-hairline px-6 py-4">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
