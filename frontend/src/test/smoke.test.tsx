import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { queryClient } from '@/app/queryClient';
import { routes } from '@/app/router';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('application shell', () => {
  it('renders the branded header and a page heading on the home route', () => {
    renderAt('/');

    expect(
      screen.getByRole('img', { name: /k pearl agency — marketing real estate/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('K Pearl Agency');
  });

  it('renders the 404 page for an unknown route', () => {
    renderAt('/no-such-page');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });

  it('renders the staff dashboard shell under /staff', () => {
    renderAt('/staff');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });
});
