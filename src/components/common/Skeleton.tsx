import React from 'react';

/**
 * Skeleton loader component props
 */
type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Skeleton loader for loading states, styled with the design system
 */
const Skeleton: React.FC<SkeletonProps> = ({ width, height, style, className }) => {
  return (
    <div
      className={`skeleton ${className || ''}`.trim()}
      style={{
        width,
        height,
        ...style,
      }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
};

export default Skeleton; 