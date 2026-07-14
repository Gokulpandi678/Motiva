'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { tokenStorage } from '@/lib/auth/tokenStorage';

/**
 * Lands here after the backend exchanges the WorkOS code and redirects back
 * with tokens in the URL fragment (never sent to any server, unlike a query
 * string). Stores them client-side, then scrubs the fragment before routing
 * home so the tokens don't linger in the visible address bar.
 */
export function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const oauthError = params.get('error');

    window.history.replaceState(null, '', window.location.pathname);

    if (oauthError) {
      setError(oauthError);
      return;
    }
    if (!accessToken || !refreshToken) {
      setError('Missing tokens in the login response.');
      return;
    }

    tokenStorage.setTokens(accessToken, refreshToken);
    router.replace('/');
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page p-6">
        <Card className="flex max-w-sm flex-col items-center gap-4 p-8 text-center">
          <p className="text-sm text-status-critical">{error}</p>
          <Button variant="primary" onClick={() => router.replace('/login')}>
            Back to sign in
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page">
      <Spinner />
    </div>
  );
}
