import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { HTMLAttributes, ReactNode } from 'react';

import { buttonClasses } from '@/components/ui';

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-ivory p-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function TableScroll({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`overflow-x-auto ${className ?? ''}`} {...props} />;
}

interface ConfirmProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmButton({
  triggerLabel,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  destructive = true,
}: ConfirmProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className={buttonClasses(
            'secondary',
            destructive ? 'border-danger text-danger hover:bg-danger hover:text-surface' : '',
          )}
        >
          {triggerLabel}
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-ink/60" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-6 shadow-xl">
          <AlertDialog.Title className="text-lg">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className={buttonClasses('ghost')}>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className={buttonClasses(
                'primary',
                destructive ? 'bg-danger text-surface hover:bg-danger/90' : '',
              )}
            >
              {confirmLabel}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
