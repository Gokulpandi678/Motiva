import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints/auth';
import { tokenStorage } from '@/lib/auth/tokenStorage';

export const currentUserQueryKey = ['auth', 'me'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => authApi.me(),
    enabled: Boolean(tokenStorage.getAccessToken()),
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: ({ logoutUrl }) => {
      tokenStorage.clear();
      queryClient.clear();
      window.location.href = logoutUrl;
    },
  });
}
