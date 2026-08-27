import type { HTMLAttributes } from 'react';

type BadgeTone = 'gold' | 'neutral';

const toneClasses: Record<BadgeTone, string> = {
  gold: 'bg-gold/15 text-gold-deep',
  neutral: 'bg-charcoal/10 text-charcoal',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className ?? ''}`}
      {...props}
    />
  );
}
