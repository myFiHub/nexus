import React from 'react';

/**
 * Input component props
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Reusable Input component styled with Tailwind v4+ best practices
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`bg-[var(--color-surface)] text-[var(--color-text-main)] border-none rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition ${className || ''}`.trim()}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 