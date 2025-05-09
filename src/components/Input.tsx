import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Input: Utility-first input field with accessible focus and brand styling.
 */
const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition duration-200 ${className}`}
    {...props}
  />
);

export default Input; 