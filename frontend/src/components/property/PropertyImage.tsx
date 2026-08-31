import { useState } from 'react';

import { propertyTypeLabel } from '@/lib/format';
import { propertyImageUrl } from '@/lib/media';
import type { PropertyMedia, PropertyType } from '@/types';

interface Props {
  media: PropertyMedia | null;
  propertyType: PropertyType;
  title: string;
  className?: string;
  /** eager for above-the-fold hero images, lazy otherwise */
  loading?: 'eager' | 'lazy';
}

/**
 * Property photo with a branded fallback. Real photos are uploaded from the
 * admin panel in Phase 6; until then (and on load errors) the placeholder shows.
 */
export function PropertyImage({ media, propertyType, title, className, loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !media || failed;

  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-ink ${className ?? ''}`}>
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-ink to-charcoal text-surface/70">
          <span aria-hidden="true" className="text-2xl">
            ◍
          </span>
          <span className="text-xs uppercase tracking-[0.2em]">
            {propertyTypeLabel(propertyType)}
          </span>
        </div>
      ) : (
        <img
          src={propertyImageUrl(media.storagePath)}
          alt={media.altText || title}
          loading={loading}
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
