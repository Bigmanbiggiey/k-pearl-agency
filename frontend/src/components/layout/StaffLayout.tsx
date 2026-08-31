import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { RouteFallback } from '@/components/layout/RouteFallback';
import { Container } from '@/components/ui';
import { BRAND } from '@/content/site';
import { RequireStaff, useAuth } from '@/features/auth';

const NAV = [
  { to: '/staff', label: 'Dashboard', end: true, admin: false },
  { to: '/staff/properties', label: 'Properties', end: false, admin: false },
  { to: '/staff/submissions', label: 'Submissions', end: false, admin: false },
  { to: '/staff/enquiries', label: 'Enquiries', end: false, admin: false },
  { to: '/staff/viewings', label: 'Viewings', end: false, admin: false },
  { to: '/staff/settings', label: 'Settings', end: false, admin: true },
  { to: '/staff/team', label: 'Team', end: false, admin: true },
] as const;

function StaffChrome() {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    void navigate('/staff/login', { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="border-b border-line bg-ivory">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-6">
            <NavLink to="/staff" className="font-display text-lg text-ink">
              {BRAND.wordmark} <span className="text-gold">Staff</span>
            </NavLink>
            <nav aria-label="Staff" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {NAV.filter((item) => !item.admin || isAdmin).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'font-medium text-gold-deep' : 'text-charcoal hover:text-gold-deep'
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>
              {profile?.fullName || 'Staff'} · {profile?.role}
            </span>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-sm border border-line px-3 py-1.5 hover:border-gold"
            >
              Sign out
            </button>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        <Container className="py-8">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
    </div>
  );
}

export function StaffLayout() {
  return (
    <RequireStaff>
      <StaffChrome />
    </RequireStaff>
  );
}
