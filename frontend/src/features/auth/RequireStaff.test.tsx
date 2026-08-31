import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { RequireAdmin, RequireStaff } from './RequireStaff';

const state = {
  current: {
    isLoading: false,
    session: null as unknown,
    isStaff: false,
    isAdmin: false,
  },
};
vi.mock('./useAuth', () => ({ useAuth: () => state.current }));

function renderGuarded(node: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={['/staff']}>
      <Routes>
        <Route path="/staff" element={node} />
        <Route path="/staff/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireStaff', () => {
  it('shows a spinner while auth is loading', () => {
    state.current = { isLoading: true, session: null, isStaff: false, isAdmin: false };
    renderGuarded(
      <RequireStaff>
        <p>secret</p>
      </RequireStaff>,
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('redirects to login when there is no session', () => {
    state.current = { isLoading: false, session: null, isStaff: false, isAdmin: false };
    renderGuarded(
      <RequireStaff>
        <p>secret</p>
      </RequireStaff>,
    );
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders children for a staff session', () => {
    state.current = { isLoading: false, session: {}, isStaff: true, isAdmin: false };
    renderGuarded(
      <RequireStaff>
        <p>secret</p>
      </RequireStaff>,
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('RequireAdmin blocks a non-admin', () => {
    state.current = { isLoading: false, session: {}, isStaff: true, isAdmin: false };
    renderGuarded(
      <RequireAdmin>
        <p>admin area</p>
      </RequireAdmin>,
    );
    expect(screen.queryByText('admin area')).not.toBeInTheDocument();
    expect(screen.getByText(/administrators only/i)).toBeInTheDocument();
  });
});
