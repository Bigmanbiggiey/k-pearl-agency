import { QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from '@/app/queryClient';
import { router } from '@/app/router';
import { RootErrorBoundary } from '@/components/RootErrorBoundary';

export function App() {
  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Analytics />
      </QueryClientProvider>
    </RootErrorBoundary>
  );
}
