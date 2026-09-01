import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Container } from '@/components/ui';
import { BRAND, PRIMARY_NAV } from '@/content/site';

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  return [
    'text-sm tracking-wide transition-colors hover:text-gold',
    isActive ? 'text-gold' : 'text-surface',
  ].join(' ');
}

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-3" aria-label={`${BRAND.name} — home`}>
      <img
        src="/assets/branding/kpearl-mark.png"
        alt=""
        className="h-10 w-10"
        width={40}
        height={40}
      />
      <span className="font-display text-lg leading-none whitespace-nowrap text-surface">
        {BRAND.wordmark} <span className="text-gold">Agency</span>
      </span>
    </NavLink>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <header className="bg-ink text-surface">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {PRIMARY_NAV.map((item) => (
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

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-surface/30 sm:hidden"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60 sm:hidden" />
            <Dialog.Content
              className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-ink p-6 text-surface shadow-xl sm:hidden"
              aria-label="Site menu"
            >
              <div className="mb-8 flex items-center justify-between">
                <Dialog.Title className="font-display text-lg leading-none whitespace-nowrap">
                  {BRAND.wordmark} <span className="text-gold">Agency</span>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-surface/30"
                    aria-label="Close menu"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>
              <nav aria-label="Mobile" className="flex flex-col gap-4">
                {PRIMARY_NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      `text-lg ${isActive ? 'text-gold' : 'text-surface'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/properties"
                  onClick={closeDrawer}
                  className="mt-4 rounded-sm bg-gold px-4 py-2.5 text-center text-sm font-medium text-ink"
                >
                  View Properties
                </NavLink>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Container>
    </header>
  );
}
