import { atomWithStorage } from 'jotai/utils';

export const sidebarCollapsedAtom = atomWithStorage<boolean>('motiva:sidebar-collapsed', false);
