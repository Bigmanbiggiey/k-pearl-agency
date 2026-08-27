import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const baseClasses =
  'inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-deep',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-surface',
  ghost: 'text-ink underline-offset-4 hover:underline',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ''}`}
      {...props}
    />
  );
}
