import { useEffect, useRef, useState } from 'react';

export type LeadFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Shared submit lifecycle for the public lead forms: status tracking, a friendly
 * error message, and a silent bot drop (honeypot filled, or submitted < 2 s
 * after mount) that reports success without touching the service.
 */
export function useLeadSubmit<V extends { company?: string | undefined }>(
  submit: (values: V) => Promise<unknown>,
) {
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const [status, setStatus] = useState<LeadFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const run = async (values: V): Promise<void> => {
    const tooFast = mountedAt.current > 0 && Date.now() - mountedAt.current < 2000;
    const honeypotFilled = Boolean(values.company && values.company.length > 0);
    if (tooFast || honeypotFilled) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);
    try {
      await submit(values);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    }
  };

  return { status, errorMessage, run, reset: () => setStatus('idle') };
}
