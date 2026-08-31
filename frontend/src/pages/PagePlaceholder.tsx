import type { ReactNode } from 'react';

import { PageHeader, Section } from '@/components/ui';

interface Props {
  title: string;
  phase: string;
  children?: ReactNode;
}

/**
 * Shared stub for pages built in a later phase. Every route resolves and is
 * navigable; the phase label says when the real content lands.
 */
export function PagePlaceholder({ title, phase, children }: Props) {
  return (
    <>
      <PageHeader eyebrow={phase} title={title} />
      <Section>
        <div className="max-w-prose text-muted">
          {children ?? <p>This page is scaffolded. Its content is built in a later phase.</p>}
        </div>
      </Section>
    </>
  );
}
