import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-md border border-line bg-ivory p-6 shadow-sm ${className ?? ''}`}
      {...props}
    />
  );
}
