import React from 'react';
import Button from '../common/Button';

// Mock trending outposts data
const mockOutposts = [
  {
    name: 'Creator Alpha',
    holders: 120,
    price: '2.34',
    volume: '1,200',
  },
  {
    name: 'Beta Collective',
    holders: 98,
    price: '1.12',
    volume: '980',
  },
  {
    name: 'Gamma Guild',
    holders: 210,
    price: '3.45',
    volume: '2,340',
  },
  {
    name: 'Delta Den',
    holders: 75,
    price: '0.89',
    volume: '750',
  },
];

const TrendingOutposts: React.FC = () => {
  // Simulate loading state
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 px-4 bg-[var(--color-surface)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Trending Outposts</h2>
          <Button variant="ghost" className="text-base font-semibold px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10">
            View All Outposts
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-[var(--color-bg)] shadow-lg border border-[var(--color-surface)] p-6 min-h-[120px]" />
              ))
            : mockOutposts.map((outpost) => (
                <div key={outpost.name} className="rounded-xl bg-[var(--color-bg)] shadow-lg border border-[var(--color-surface)] p-6 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">{outpost.name}</h3>
                  <div className="flex flex-col items-center text-[var(--color-text-muted)] text-sm gap-1">
                    <span>Holders: <span className="text-[var(--color-text-main)] font-semibold">{outpost.holders}</span></span>
                    <span>Price: <span className="text-[var(--color-primary)] font-semibold">{outpost.price} MOVE</span></span>
                    <span>24h Vol: <span className="text-[var(--color-secondary)] font-semibold">{outpost.volume}</span></span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOutposts; 