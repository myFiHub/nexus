import React from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * OutpostHeader props
 */
type OutpostHeaderProps = {
  outpost: {
    name: string;
    avatar?: string;
    owner: string;
    stats: { price: number; marketCap: number; holders: number; volume24h: number };
  };
};

/**
 * OutpostHeader: header section for Outpost Detail page
 */
const OutpostHeader: React.FC<OutpostHeaderProps> = ({ outpost }) => {
  return (
    <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-8 mb-8">
      <div className="flex flex-col items-center md:items-start md:flex-row gap-6 flex-1">
        <div className="text-6xl bg-neutral-100 rounded-full w-24 h-24 flex items-center justify-center" aria-hidden>
          {outpost.avatar || '🏰'}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{outpost.name}</h1>
          <div className="text-neutral-600 mb-2">by <span className="font-mono">{outpost.owner}</span></div>
          {/* Social links placeholder */}
          <div className="flex gap-2 mb-2">
            <span className="text-neutral-400">@twitter</span>
            <span className="text-neutral-400">@discord</span>
          </div>
          <div className="flex gap-4 text-sm text-neutral-700">
            <span>Price: <b>{outpost.stats.price}Ξ</b></span>
            <span>Market Cap: <b>{outpost.stats.marketCap}Ξ</b></span>
            <span>Holders: <b>{outpost.stats.holders}</b></span>
            <span>24h Vol: <b>{outpost.stats.volume24h}Ξ</b></span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="primary">Buy Pass</Button>
        <Button variant="secondary">Sell Pass</Button>
        <Button variant="ghost">Subscribe</Button>
      </div>
    </Card>
  );
};

export default OutpostHeader; 