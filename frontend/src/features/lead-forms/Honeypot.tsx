import type { UseFormRegisterReturn } from 'react-hook-form';

/**
 * Off-screen field a human never fills. Bots that auto-complete every input give
 * themselves away; `useLeadSubmit` drops those submissions silently.
 * Pass the form's `register('company')` result as `field`.
 */
export function Honeypot({ field }: { field: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" type="text" tabIndex={-1} autoComplete="off" {...field} />
    </div>
  );
}
