import type { UseFormRegisterReturn } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Checkbox } from '@/components/ui';
import { CONSENT_STATEMENT } from '@/content/legal';

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
            {CONSENT_STATEMENT.before}{' '}
            <Link to="/privacy" className="text-gold-deep underline underline-offset-2">
              {CONSENT_STATEMENT.linkText}
            </Link>{' '}
            {CONSENT_STATEMENT.after}
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
