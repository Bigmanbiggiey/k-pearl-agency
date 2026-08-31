import type { ReactNode } from 'react';

interface Props {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  message?: string | null;
  children?: ReactNode;
}

/** Sticky action bar for the property editor. */
export function SaveBar({ dirty, saving, onSave, message, children }: Props) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted" role="status">
          {message ?? (dirty ? 'Unsaved changes' : 'All changes saved')}
        </p>
        <div className="flex items-center gap-3">
          {children}
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !dirty}
            className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
