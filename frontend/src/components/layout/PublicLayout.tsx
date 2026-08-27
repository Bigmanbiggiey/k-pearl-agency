import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only rounded-sm bg-gold px-4 py-2 text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
