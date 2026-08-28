import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { routes } from '@/app/router';

// The public site pulls live data in a few places; stub it so the shell tests
// stay hermetic. Behaviour of the data hooks is covered by their own tests and
// the integration suite.
vi.mock('@/hooks/useSiteSettings', () => ({ useSiteSettings: () => ({ data: undefined }) }));
// Logged-out staff auth so /staff redirects to the login page (real guard kept).
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ isLoading: false, session: null, isStaff: false, isAdmin: false }),
}));
vi.mock('@/hooks', () => ({
  useSiteSettings: () => ({ data: undefined }),
  useAreas: () => ({ data: [] }),
  groupAreasByCounty: () => [],
  useFeaturedProperties: () => ({ data: [], isLoading: false, isError: false }),
  useLatestProperties: () => ({ data: [], isLoading: false, isError: false }),
  useProperty: () => ({ data: null, isLoading: false, isError: false }),
}));

function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('application shell', () => {
  it('renders the branded header and a heading on the home route', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('img', { name: /k pearl agency — marketing real estate/i }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown route', async () => {
    renderAt('/no-such-page');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });

  it('redirects /staff to the sign-in page when logged out', async () => {
    renderAt('/staff');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Staff sign in');
  });
});
