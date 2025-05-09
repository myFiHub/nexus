import React from 'react';

/**
 * Select component props
 */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Reusable Select component styled with Tailwind v4+ best practices
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`bg-[var(--color-surface)] text-[var(--color-text-main)] border-none rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select; 