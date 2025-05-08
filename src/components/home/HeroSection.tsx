import React from 'react';
import Button from '../common/Button';

/**
 * HeroSection for the Home page: headline, subheading, and CTAs
 */
const HeroSection: React.FC = () => {
  return (
    <section className="py-16 text-center bg-gradient-to-b from-primary-100 to-neutral-50">
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--primary-500)' }}>
        Support What Interests You
      </h1>
      <p className="text-lg mb-8 text-neutral-700 max-w-xl mx-auto">
        Discover, support, and join the next generation of creator communities. Buy passes, subscribe to exclusive content, and be part of the SocialFi revolution.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary" style={{ minWidth: 180 }}>Discover Creators</Button>
        <Button variant="secondary" style={{ minWidth: 180 }}>Start Your Outpost</Button>
      </div>
    </section>
  );
};

export default HeroSection; 