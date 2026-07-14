import { useEffect, useState } from 'react';

/**
 * Portal-based components (`Modal`, `Drawer`, `ToastContainer`) call
 * `createPortal(..., document.body)` unconditionally at render time. That was
 * safe in the old Vite SPA — nothing ever rendered outside the browser — but
 * Next.js still runs an initial server-side render pass for Client
 * Components, where `document` doesn't exist. Gating the portal behind this
 * hook changes nothing observable (every one of these starts closed/empty on
 * first paint anyway) while avoiding the SSR crash.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
