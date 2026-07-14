import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { toastsAtom, type Toast, type ToastVariant } from '@/atoms/toast';

const AUTO_DISMISS_MS = 5000;

export function useToast() {
  const [toasts, setToasts] = useAtom(toastsAtom);

  const dismiss = useCallback(
    (id: string) => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    },
    [setToasts],
  );

  const push = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const toast: Toast = { id: crypto.randomUUID(), variant, title, description };
      setToasts((current) => [...current, toast]);
      setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
    },
    [setToasts, dismiss],
  );

  return {
    toasts,
    dismiss,
    success: useCallback((title: string, description?: string) => push('success', title, description), [push]),
    error: useCallback((title: string, description?: string) => push('error', title, description), [push]),
    info: useCallback((title: string, description?: string) => push('info', title, description), [push]),
  };
}
