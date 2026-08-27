import { Link } from 'react-router-dom';

import { Container } from '@/components/ui';
import { BRAND, FOOTER_EXPLORE } from '@/content/site';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact';

export function Footer() {
  const year = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  return (
    <footer className="mt-24 bg-ink text-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-gold">{BRAND.name}</p>
          <p className="mt-2 max-w-xs text-sm text-surface/70">{BRAND.tagline}.</p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-medium text-surface/60">Explore</p>
          <ul className="space-y-2">
            {FOOTER_EXPLORE.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-medium text-surface/60">Contact</p>
          <ul className="space-y-2 text-surface/70">
            {settings ? (
              <>
                <li>
                  <a href={telHref(settings.phone)} className="hover:text-gold">
                    Call {settings.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappHref(settings.whatsapp)}
                    className="hover:text-gold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={mailtoHref(settings.email)} className="hover:text-gold">
                    {settings.email}
                  </a>
                </li>
                {settings.byAppointment ? <li>Viewings &amp; meetings by appointment</li> : null}
              </>
            ) : (
              <li className="text-surface/50">Loading…</li>
            )}
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
