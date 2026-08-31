import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { PropertyFilters } from './PropertyFilters';

import type { PropertySearchInput } from '@/schemas';

interface Props {
  filters: PropertySearchInput;
  setFilter: <K extends keyof PropertySearchInput>(key: K, value: PropertySearchInput[K]) => void;
  onClear: () => void;
  activeCount: number;
  resultCount: number;
}

/** Mobile/tablet filter panel in a Radix Dialog. Sidebar is used at `lg`+. */
export function FiltersSheet({ filters, setFilter, onClear, activeCount, resultCount }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-sm border border-ink px-4 py-2 text-sm font-medium text-ink lg:hidden"
        >
          Filters
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs text-ink">
              {activeCount}
            </span>
          ) : null}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-xl bg-surface p-6"
          aria-label="Property filters"
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg">Filters</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line"
                aria-label="Close filters"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <PropertyFilters filters={filters} setFilter={setFilter} onClear={onClear} />

          <Dialog.Close asChild>
            <button
              type="button"
              className="mt-8 w-full rounded-sm bg-gold px-4 py-3 text-sm font-medium text-ink"
            >
              Show {resultCount} {resultCount === 1 ? 'property' : 'properties'}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
