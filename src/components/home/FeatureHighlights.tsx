import React from 'react';

const features = [
  {
    title: 'Lifetime Value',
    description: 'Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.'
  },
  {
    title: 'Direct Support',
    description: 'Skip the middleman. Support creators directly while participating in their growth through smart contracts.'
  },
  {
    title: 'Community Owned',
    description: 'Join exclusive outposts where creators and fans build value together through transparent tokenomics.'
  },
];

const FeatureHighlights: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-[var(--color-bg)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="p-6 rounded-xl bg-[var(--color-surface)] shadow-lg border border-[var(--color-bg)]"
          >
            <h3 className="text-xl text-[var(--color-primary)] font-semibold mb-2">{feature.title}</h3>
            <p className="text-[var(--color-text-muted)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights; 