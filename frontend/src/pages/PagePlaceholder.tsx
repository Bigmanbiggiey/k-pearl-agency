import type { ReactNode } from 'react';

import { Container } from '@/components/ui';

interface Props {
  title: string;
  phase: string;
  children?: ReactNode;
}

/**
 * Shared stub for Phase 1. Every route resolves and is navigable; real content
 * and behaviour arrive in the phase noted on each page.
 */
export function PagePlaceholder({ title, phase, children }: Props) {
  return (
    <Container className="py-20">
      <p className="text-xs font-medium uppercase tracking-widest text-gold-deep">{phase}</p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      <div className="mt-4 max-w-prose text-muted">
        {children ?? <p>This page is scaffolded. Its content is built in a later phase.</p>}
      </div>
    </Container>
  );
}
