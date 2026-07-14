'use client';

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';

// A QueryClient held in module scope (as the old Vite SPA did) would be
// shared across concurrent server-rendered requests in Next.js's long-lived
// Node process. Creating one per component instance (stable for the life of
// the mount thanks to useState) keeps every other call site — useQuery,
// useMutation, useQueryClient — working exactly as before.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
