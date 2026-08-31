import type { HTMLAttributes } from 'react';

import { Container } from './Container';

type SectionTone = 'default' | 'ink' | 'surface-alt';

const toneClasses: Record<SectionTone, string> = {
  default: '',
  ink: 'bg-ink text-surface',
  'surface-alt': 'bg-ivory',
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  /** Drop the inner Container (for full-bleed content). */
  bleed?: boolean;
  containerClassName?: string;
}

/** A vertical page band with consistent rhythm and an optional dark tone. */
export function Section({
  tone = 'default',
  bleed = false,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${toneClasses[tone]} ${className ?? ''}`} {...props}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
