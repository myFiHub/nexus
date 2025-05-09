import React from 'react';
import classNames from 'classnames';

/**
 * Card component props
 */
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
  children: React.ReactNode;
};

/**
 * Reusable Card component with Tailwind v4+ best practices
 */
const Card: React.FC<CardProps> = ({ hoverable = false, children, className, ...props }) => {
  // Tailwind v4+ utility classes for card
  const base = 'bg-[var(--color-surface)] rounded-xl shadow-lg p-8';
  const hover = hoverable ? 'transition-transform hover:-translate-y-1 hover:shadow-xl' : '';
  return (
    <div
      className={classNames(base, hover, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 