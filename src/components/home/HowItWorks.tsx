import React from 'react';

const steps = [
  { step: 1, title: 'Connect', description: 'Sign in with your social account or wallet' },
  { step: 2, title: 'Discover', description: 'Find creators you want to support' },
  { step: 3, title: 'Support', description: 'Buy passes and join exclusive communities' },
  { step: 4, title: 'Grow', description: 'Watch your value grow with the community' },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-10">How Podium Nexus Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold mb-4">
                {item.step}
              </div>
              <h4 className="text-xl font-semibold text-[var(--color-primary)] mb-2">{item.title}</h4>
              <p className="text-[var(--color-text-muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 