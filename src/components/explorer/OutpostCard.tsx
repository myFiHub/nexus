import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * OutpostCard props
 */
type OutpostCardProps = {
  outpost: {
    name: string;
    avatar?: string;
    stats: { holders: number; price: number; volume24h: number };
  };
};

/**
 * OutpostCard: displays outpost info in a card
 */
const OutpostCard: React.FC<OutpostCardProps> = ({ outpost }) => {
  return (
    <Card hoverable className="flex flex-col items-center p-6">
      <div className="text-4xl mb-2" aria-hidden>{outpost.avatar || '🏰'}</div>
      <h3 className="text-lg font-semibold mb-1">{outpost.name}</h3>
      <div className="flex gap-2 text-xs text-neutral-600 mb-2">
        <span>Holders: <b>{outpost.stats.holders}</b></span>
        <span>· Price: <b>{outpost.stats.price}Ξ</b></span>
        <span>· Vol: <b>{outpost.stats.volume24h}Ξ</b></span>
      </div>
      <Button variant="primary">View</Button>
    </Card>
  );
};

export default OutpostCard; 