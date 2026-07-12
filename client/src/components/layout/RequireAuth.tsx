import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { Spinner } from '@/components/ui/Spinner';

export function RequireAuth() {
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const { data: user, isLoading, isError } = useCurrentUser();

  if (!hasToken || isError) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
}
