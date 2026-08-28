import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Seo } from '@/components/Seo';

export function StaffAuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Seo title={title} description="K Pearl Agency staff area." path="/staff/login" noindex />
      <div className="flex min-h-dvh items-center justify-center bg-ink px-4 py-16">
        <div className="w-full max-w-sm rounded-md bg-surface p-8 shadow-xl">
          <Link to="/" className="mb-6 block text-center font-display text-xl text-ink">
            K.pearl <span className="text-gold">Staff</span>
          </Link>
          <h1 className="text-xl">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </>
  );
}
