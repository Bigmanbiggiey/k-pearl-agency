import { Link } from 'react-router-dom';

import { Container } from '@/components/ui';

/**
 * Contact values are placeholders pending Phase 0 decisions 15.a–15.f
 * (docs/phase-0-decision-register.md). They will be sourced from config or the
 * `site_settings` record once confirmed — never invented.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-gold">K.pearl Agency</p>
          <p className="mt-2 max-w-xs text-sm text-surface/70">
            Marketing real estate, creating value.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-medium text-surface/60">Explore</p>
          <ul className="space-y-2">
            <li>
              <Link to="/properties" className="hover:text-gold">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-gold">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/list-your-property" className="hover:text-gold">
                List your property
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-medium text-surface/60">Contact</p>
          <ul className="space-y-2 text-surface/70">
            <li>Phone: to be confirmed</li>
            <li>WhatsApp: to be confirmed</li>
            <li>Email: to be confirmed</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-surface/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-surface/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} K Pearl Agency. All rights reserved.</p>
          <p className="flex gap-4">
            <Link to="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gold">
              Terms
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
