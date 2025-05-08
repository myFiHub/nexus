import React from 'react';
import Card from '../common/Card';

/**
 * Data for feature highlight cards
 */
const features = [
  {
    icon: '💎',
    title: 'Lifetime Value',
    description: 'Earn and trade creator passes with dynamic bonding curve pricing for lasting value.'
  },
  {
    icon: '🤝',
    title: 'Direct Support',
    description: 'Support your favorite creators directly and access exclusive content and perks.'
  },
  {
    icon: '🌐',
    title: 'Community Owned',
    description: 'Join a decentralized, community-driven platform where everyone has a stake.'
  }
];

/**
 * FeatureHighlights for the Home page: three benefit-driven cards
 */
const FeatureHighlights: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row gap-6 justify-center">
        {features.map((feature, idx) => (
          <Card key={feature.title} hoverable className="flex-1 text-center p-8 flex flex-col items-center">
            <div className="text-4xl mb-4" aria-hidden>{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-neutral-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights; 