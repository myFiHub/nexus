import React from 'react';
import Card from '../common/Card';

/**
 * Data for how-it-works steps
 */
const steps = [
  {
    title: 'Connect Wallet',
    description: 'Sign in securely with your wallet or social login.'
  },
  {
    title: 'Discover Outposts',
    description: 'Browse and explore trending creator communities.'
  },
  {
    title: 'Buy Pass or Subscribe',
    description: 'Support creators by buying passes or subscribing to tiers.'
  },
  {
    title: 'Join & Engage',
    description: 'Access exclusive content and join the community.'
  }
];

/**
 * HowItWorks for the Home page: four-step process
 */
const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <Card key={step.title} className="flex flex-col items-center p-8">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold mb-4" style={{ color: 'var(--primary-500)' }}>
                {idx + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">{step.title}</h3>
              <p className="text-neutral-600 text-center">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 