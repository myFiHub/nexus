import React from 'react';
import Button from '../common/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center py-20 md:py-32 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface)]">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent mb-6 drop-shadow-lg">
        Support What Interests You
      </h1>
      <p className="text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl mb-10">
        Discover, support, and join the next generation of creator communities. Own your influence, earn rewards, and unlock exclusive content—all on Podium Nexus.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          className="text-lg px-8 py-4 font-bold shadow-lg"
          aria-label="Discover Creators"
        >
          Discover Creators
        </Button>
        <Button
          variant="ghost"
          className="text-lg px-8 py-4 font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
          aria-label="Start Your Outpost"
        >
          Start Your Outpost
        </Button>
      </div>
    </section>
  );
};

export default HeroSection; 