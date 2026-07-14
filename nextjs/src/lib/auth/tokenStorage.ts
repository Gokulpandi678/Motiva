const ACCESS_TOKEN_KEY = 'motiva:access_token';
const REFRESH_TOKEN_KEY = 'motiva:refresh_token';

// `localStorage` doesn't exist during Next.js's server-side render pass of a
// Client Component (unlike the old Vite SPA, which only ever ran in the
// browser). `isBrowser` guards every method below so the *first* render
// (server + pre-hydration) behaves as "no token yet" — which is exactly what
// the real browser read would momentarily show anyway — rather than
// throwing. Once mounted, this reads/writes real localStorage exactly as
// before.
const isBrowser = typeof window !== 'undefined';

/** Single source of truth for where tokens live — swap this file's internals to change storage strategy everywhere at once. */
export const tokenStorage = {
  getAccessToken(): string | null {
    return isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },
  getRefreshToken(): string | null {
    return isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },
  setTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear(): void {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
