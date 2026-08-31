import type { HTMLAttributes } from 'react';

/**
 * Readable long-form text column. Tailwind v4 has no typography plugin here, so
 * spacing is set explicitly on child elements.
 */
export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        'max-w-2xl text-[0.975rem] leading-7 text-charcoal',
        '[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl',
        '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl',
        '[&_p]:mt-4 [&_p:first-child]:mt-0',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1.5',
        '[&_a]:text-gold-deep [&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        className ?? '',
      ].join(' ')}
      {...props}
    />
  );
}
