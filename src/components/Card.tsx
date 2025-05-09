import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card: Utility-first container for grouping content with padding, background, and shadow.
 */
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-[var(--color-surface)] rounded-lg shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export default Card; 