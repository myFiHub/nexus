import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Placeholder trending outposts data
 */
const trendingOutposts = [
  {
    name: 'CryptoCat',
    avatar: '😺',
    holders: 1200,
    price: '0.42',
    volume: '12.3',
  },
  {
    name: 'ArtByAda',
    avatar: '🎨',
    holders: 980,
    price: '0.31',
    volume: '8.7',
  },
  {
    name: 'GameGuild',
    avatar: '🎮',
    holders: 1500,
    price: '0.55',
    volume: '15.1',
  },
  {
    name: 'MusicDAO',
    avatar: '🎵',
    holders: 800,
    price: '0.28',
    volume: '6.2',
  },
];

/**
 * TrendingOutposts for the Home page: grid of trending outpost cards
 */
const TrendingOutposts: React.FC = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Outposts</h2>
          <Button variant="ghost">View All Outposts</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingOutposts.map((outpost) => (
            <Card key={outpost.name} hoverable className="flex flex-col items-center p-6">
              <div className="text-4xl mb-2" aria-hidden>{outpost.avatar}</div>
              <h3 className="text-lg font-semibold mb-1">{outpost.name}</h3>
              <div className="flex gap-2 text-xs text-neutral-600 mb-2">
                <span>Holders: <b>{outpost.holders}</b></span>
                <span>· Price: <b>{outpost.price}Ξ</b></span>
                <span>· Vol: <b>{outpost.volume}Ξ</b></span>
              </div>
              <Button variant="primary">View</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOutposts; 