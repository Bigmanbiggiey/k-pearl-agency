import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { propertyTypeLabel } from '@/lib/format';
import { propertyImageUrl } from '@/lib/media';
import type { PropertyMedia, PropertyType } from '@/types';

interface Props {
  media: PropertyMedia[];
  propertyType: PropertyType;
  title: string;
}

export function PropertyGallery({ media, propertyType, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (media.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md bg-gradient-to-br from-ink to-charcoal text-surface/70">
        <span className="text-sm uppercase tracking-[0.2em]">
          {propertyTypeLabel(propertyType)} — photos coming soon
        </span>
      </div>
    );
  }

  const ordered = [...media].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {ordered.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={`overflow-hidden rounded-md bg-ink ${index === 0 ? 'sm:col-span-2' : ''}`}
          >
            <img
              src={propertyImageUrl(item.storagePath)}
              alt={item.altText || `${title} — photo ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`w-full object-cover ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
            />
          </button>
        ))}
      </div>

      <Dialog.Root open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/90" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-label={`${title} — photo`}
          >
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-surface/40 text-surface"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </Dialog.Close>
            {openIndex !== null && ordered[openIndex] ? (
              <img
                src={propertyImageUrl(ordered[openIndex].storagePath)}
                alt={ordered[openIndex].altText || title}
                className="max-h-full max-w-full rounded-md object-contain"
              />
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
