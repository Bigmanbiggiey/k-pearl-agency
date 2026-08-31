interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** Build a windowed page list like [1, '…', 4, 5, 6, '…', 12]. */
function pageWindow(current: number, count: number): Array<number | 'gap'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set<number>([1, count, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

const btn =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-sm border border-line px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40';

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), pageCount));

  return (
    <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Pagination">
      <button type="button" className={btn} onClick={() => go(page - 1)} disabled={page <= 1}>
        ‹ Prev
      </button>

      {/* compact on mobile */}
      <span className="text-sm text-muted sm:hidden">
        Page {page} of {pageCount}
      </span>

      <ul className="hidden gap-1 sm:flex">
        {pageWindow(page, pageCount).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} className="px-2 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`${btn} ${item === page ? 'border-gold bg-gold/15 font-semibold text-gold-deep' : ''}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={btn}
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
      >
        Next ›
      </button>
    </nav>
  );
}
