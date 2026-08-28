import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

const CONTROL =
  'w-full rounded-sm border border-line bg-ivory px-3 py-2.5 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-gold aria-[invalid=true]:border-danger';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  required?: boolean | undefined;
  hint?: string | undefined;
  children: ReactNode;
}

/** Label + control + error, wired for accessibility. */
export function FormField({ label, htmlFor, error, required, hint, children }: FieldProps) {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-charcoal">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={`${CONTROL} ${className ?? ''}`} {...props} />;
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={`${CONTROL} ${className ?? ''}`} {...props} />;
});

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectInput({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={`${CONTROL} ${className ?? ''}`} {...props}>
        {children}
      </select>
    );
  },
);

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label htmlFor={inputId} className="flex items-start gap-2 text-sm text-charcoal">
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={`mt-0.5 h-4 w-4 shrink-0 accent-gold ${className ?? ''}`}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
});
