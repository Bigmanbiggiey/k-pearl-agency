import { useRef, useState } from 'react';

import { ConfirmButton } from './misc';

import { usePropertyMedia, usePropertyMediaActions } from '@/features/staff/hooks';
import { propertyMediaRepository } from '@/repositories';

interface Props {
  propertyId: string;
}

/** Image manager for a saved property: upload, alt text, cover, order, remove. */
export function MediaManager({ propertyId }: Props) {
  const { data: media = [], isLoading } = usePropertyMedia(propertyId);
  const { upload, update, remove, reorder } = usePropertyMediaActions(propertyId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    for (const file of Array.from(files)) {
      try {
        await upload.mutateAsync({ file, altText: '' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed.');
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const move = (index: number, delta: number) => {
    const next = [...media];
    const target = index + delta;
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    reorder.mutate(next.map((m) => m.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => void onFiles(e.target.files)}
          className="block text-sm text-charcoal file:mr-3 file:rounded-sm file:border file:border-line file:bg-ivory file:px-3 file:py-1.5 file:text-sm"
        />
        <p className="mt-1 text-xs text-muted">JPEG, PNG, WebP or AVIF · up to 8 MB each.</p>
        {upload.isPending ? <p className="mt-1 text-xs text-muted">Uploading…</p> : null}
        {error ? (
          <p className="mt-1 text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading images…</p>
      ) : media.length === 0 ? (
        <p className="rounded-md border border-line bg-ivory p-6 text-center text-sm text-muted">
          No images yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {media.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start gap-3 rounded-md border border-line bg-ivory p-3"
            >
              <img
                src={propertyMediaRepository.publicUrl(item.storagePath)}
                alt={item.altText || 'Property image'}
                className="h-20 w-28 shrink-0 rounded-sm object-cover"
                loading="lazy"
              />
              <div className="min-w-[12rem] flex-1 space-y-2">
                <input
                  type="text"
                  defaultValue={item.altText}
                  placeholder="Alt text (describe the image)"
                  onBlur={(e) => {
                    if (e.target.value.trim() !== item.altText) {
                      update.mutate({ id: item.id, altText: e.target.value });
                    }
                  }}
                  className="w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
                />
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {item.isCover ? (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 font-medium text-gold-deep">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => update.mutate({ id: item.id, isCover: true })}
                      className="rounded-sm border border-line px-2 py-0.5 hover:border-gold"
                    >
                      Set as cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-sm border border-line px-2 py-0.5 disabled:opacity-40"
                    aria-label="Move image up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === media.length - 1}
                    className="rounded-sm border border-line px-2 py-0.5 disabled:opacity-40"
                    aria-label="Move image down"
                  >
                    ↓
                  </button>
                  <ConfirmButton
                    triggerLabel="Remove"
                    title="Remove this image?"
                    description="The file is deleted from storage. This cannot be undone."
                    confirmLabel="Remove"
                    onConfirm={() => remove.mutate(item.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
