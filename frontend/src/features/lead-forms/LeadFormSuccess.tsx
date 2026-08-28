import type { ReactNode } from 'react';

export function LeadFormSuccess({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-success/40 bg-success/10 p-6" role="status">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-2 text-sm text-charcoal">{children}</p>
    </div>
  );
}
