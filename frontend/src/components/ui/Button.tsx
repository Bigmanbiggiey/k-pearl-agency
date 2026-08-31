import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const baseClasses =
  'inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-deep',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-surface',
  ghost: 'text-ink underline-offset-4 hover:underline',
};

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string): string {
  return `${baseClasses} ${variantClasses[variant]} ${className ?? ''}`;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = LinkProps & { variant?: ButtonVariant };

/** A react-router Link styled as a button. */
export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant };

/** A plain anchor styled as a button (for `tel:` / `mailto:` / `wa.me`). */
export function ButtonAnchor({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonAnchorProps) {
  return (
    <a className={buttonClasses(variant, className)} {...props}>
      {children}
    </a>
  );
}
