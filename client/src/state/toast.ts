import { atom } from 'jotai';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

export const toastsAtom = atom<Toast[]>([]);
