import type { UseFormRegisterReturn } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Checkbox } from '@/components/ui';

interface Props {
  field: UseFormRegisterReturn;
  error?: string | undefined;
}

export function ConsentField({ field, error }: Props) {
  return (
    <div>
      <Checkbox
        id="consent"
        aria-invalid={error ? true : undefined}
        {...field}
        label={
          <>
            I have read the{' '}
            <Link to="/privacy" className="text-gold-deep underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            and agree to be contacted about my enquiry.
          </>
        }
      />
      {error ? (
        <p className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
