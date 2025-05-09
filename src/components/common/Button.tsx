import React from 'react';
import classNames from 'classnames';

/**
 * Button variants as per design system
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: React.ReactNode;
};

/**
 * Reusable Button component with Tailwind v4+ best practices
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  ...props
}) => {
  // Tailwind v4+ utility classes for each variant
  const base = 'font-semibold py-2 px-4 rounded-lg shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const variants: Record<ButtonVariant, string> = {
    primary: `${base} text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] focus-visible:ring-[var(--color-primary)]`,
    secondary: `${base} text-white bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] focus-visible:ring-[var(--color-secondary)]`,
    ghost: `${base} text-[var(--color-primary)] bg-transparent border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10`,
  };
  return (
    <button
      className={classNames(variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 