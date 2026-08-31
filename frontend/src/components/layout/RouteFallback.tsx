/** Branded fallback while a lazily-loaded route chunk downloads. */
export function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
