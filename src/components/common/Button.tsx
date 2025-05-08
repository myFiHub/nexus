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
  const base = 'font-semibold py-2 px-4 rounded-lg shadow transition focus:outline-none';
  const variants: Record<ButtonVariant, string> = {
    primary: `${base} text-white` + ' ' + '[background-color:#d946ef] hover:[background-color:#a21caf] focus:ring-2 focus:ring-fuchsia-400',
    secondary: `${base} text-white` + ' ' + '[background-color:var(--secondary-500)] hover:[background-color:var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]',
    ghost: `${base} text-[var(--primary-500)] bg-transparent border border-[var(--primary-500)] hover:bg-[var(--primary-100)]`,
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