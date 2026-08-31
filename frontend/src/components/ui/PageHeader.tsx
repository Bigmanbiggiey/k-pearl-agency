import type { ReactNode } from 'react';

import { Container } from './Container';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
}

/** Standard top-of-page block: small eyebrow label, h1, optional lede paragraph. */
export function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <div className="bg-ink text-surface">
      <Container className="py-16 sm:py-20">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {lede ? <p className="mt-4 max-w-2xl text-lg text-surface/75">{lede}</p> : null}
      </Container>
    </div>
  );
}
