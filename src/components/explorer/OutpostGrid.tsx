import React from 'react';
import OutpostCard from './OutpostCard';

/**
 * OutpostGrid props
 */
type OutpostGridProps = {
  outposts: Array<{
    name: string;
    avatar?: string;
    stats: { holders: number; price: number; volume24h: number };
  }>;
};

/**
 * OutpostGrid: displays a grid of OutpostCard components
 */
const OutpostGrid: React.FC<OutpostGridProps> = ({ outposts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {outposts.map((outpost) => (
        <OutpostCard key={outpost.name} outpost={outpost} />
      ))}
    </div>
  );
};

export default OutpostGrid; 