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
      className={`border rounded-lg px-4 py-2 bg-white text-black focus:outline-none transition ${className || ''}`.trim()}
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--primary-500)', color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select; 