import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-bg)]',
  danger: 'bg-[var(--color-error)] text-white hover:bg-red-700',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button; 