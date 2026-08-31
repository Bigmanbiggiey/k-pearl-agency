import * as Dialog from '@radix-ui/react-dialog';
import { useState, type ReactNode } from 'react';

import { buttonClasses, type ButtonVariant } from '@/components/ui';

interface Props {
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  title: string;
  children: ReactNode;
}

export function LeadDialog({ triggerLabel, triggerVariant = 'primary', title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={buttonClasses(triggerVariant, 'w-full')}>
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(34rem,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-surface p-6 shadow-xl"
          aria-describedby={undefined}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <Dialog.Title className="text-xl">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
