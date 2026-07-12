import { requestItem } from '../request';
import type { User } from '@/types/auth';

export const authApi = {
  me(): Promise<User> {
    return requestItem<User>({ url: '/auth/me', method: 'GET' });
  },

  logout(): Promise<{ logoutUrl: string }> {
    return requestItem<{ logoutUrl: string }>({ url: '/auth/logout', method: 'POST' });
  },
};
