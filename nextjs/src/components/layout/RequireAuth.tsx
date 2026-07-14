'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { Spinner } from '@/components/ui/Spinner';

// react-router's <Navigate> performed this redirect synchronously as part of
// render, producing no visible output itself. Next.js's client-side router
// has no render-time redirect primitive for Client Components, so the
// equivalent has to fire from an effect — rendering `null` (not a spinner)
// in the meantime keeps the same "nothing visible, then gone" behavior
// rather than introducing a spinner flash that didn't exist before.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const { data: user, isLoading, isError } = useCurrentUser();

  const shouldRedirect = !hasToken || isError;

  useEffect(() => {
    if (shouldRedirect) router.replace('/login');
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
