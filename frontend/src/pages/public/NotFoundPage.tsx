import { Link } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { Container } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for does not exist."
        path="/404"
        noindex
      />
      <Container className="py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">404</p>
        <h1 className="mt-3 text-4xl">Page not found</h1>
        <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep"
        >
          Back to home
        </Link>
      </Container>
    </>
  );
}
