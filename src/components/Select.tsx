import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  className?: string;
}

/**
 * Select: Utility-first select dropdown with accessible focus and brand styling.
 */
const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => (
  <select
    className={`w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition duration-200 ${className}`}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default Select; 