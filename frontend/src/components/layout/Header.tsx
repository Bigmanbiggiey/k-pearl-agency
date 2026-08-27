import { NavLink } from 'react-router-dom';

import { Container } from '@/components/ui';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/properties', label: 'Properties', end: false },
  { to: '/services', label: 'Services', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const;

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  return [
    'text-sm tracking-wide transition-colors hover:text-gold',
    isActive ? 'text-gold' : 'text-surface',
  ].join(' ');
}

export function Header() {
  return (
    <header className="bg-ink text-surface">
      <Container className="flex items-center justify-between gap-6 py-4">
        <NavLink to="/" className="flex items-center" aria-label="K Pearl Agency — home">
          <img
            src="/assets/branding/k-pearl-logo.png"
            alt="K Pearl Agency — marketing real estate, creating value"
            className="h-12 w-auto"
            width={48}
            height={48}
          />
        </NavLink>

        {/* Mobile navigation (drawer) is a Phase 3 task. */}
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClasses}>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/properties"
            className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-deep"
          >
            View Properties
          </NavLink>
        </nav>
      </Container>
    </header>
  );
}
