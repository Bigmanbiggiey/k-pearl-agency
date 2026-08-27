import { Link, Outlet } from 'react-router-dom';

import { StaffAuthGuard } from '@/components/layout/StaffAuthGuard';
import { Container } from '@/components/ui';

export function StaffLayout() {
  return (
    <StaffAuthGuard>
      <div className="flex min-h-dvh flex-col bg-surface">
        <header className="bg-ink text-surface">
          <Container className="flex items-center justify-between py-4">
            <Link to="/staff" className="font-display text-lg text-gold">
              K Pearl Staff
            </Link>
            <Link to="/" className="text-sm text-surface/70 hover:text-gold">
              View public site
            </Link>
          </Container>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </StaffAuthGuard>
  );
}
