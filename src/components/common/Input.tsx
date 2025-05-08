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
      className={`border rounded-lg px-4 py-2 focus:outline-none transition ${className || ''}`.trim()}
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--primary-500)', color: 'var(--text-primary)' }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 