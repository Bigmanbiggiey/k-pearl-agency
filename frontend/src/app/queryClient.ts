import { QueryClient } from '@tanstack/react-query';

/** Shared query client. Conservative defaults; no realtime (CLAUDE.md §10). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
