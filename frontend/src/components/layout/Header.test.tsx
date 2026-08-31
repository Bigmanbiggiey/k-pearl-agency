import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Header } from '@/components/layout/Header';
import { renderWithProviders } from '@/test/utils';

describe('Header', () => {
  it('renders the logo and primary navigation', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: /k\.pearl agency — home/i })).toBeInTheDocument();
    expect(screen.getByText('K.pearl')).toBeInTheDocument();
    const primaryNav = screen.getByRole('navigation', { name: 'Primary' });
    expect(primaryNav).toBeInTheDocument();
  });

  it('opens and closes the mobile menu drawer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
