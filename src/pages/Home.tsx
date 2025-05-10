import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

const features = [
  {
    title: 'Lifetime Value',
    desc: 'Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.',
  },
  {
    title: 'Direct Support',
    desc: 'Skip the middleman. Support creators directly while participating in their growth through smart contracts.',
  },
  {
    title: 'Community Owned',
    desc: 'Join exclusive outposts where creators and fans build value together through transparent tokenomics.',
  },
];

const howItWorks = [
  { step: 1, title: 'Connect', desc: 'Sign in with your social account or wallet' },
  { step: 2, title: 'Discover', desc: 'Find creators you want to support' },
  { step: 3, title: 'Support', desc: 'Buy passes and join exclusive communities' },
  { step: 4, title: 'Grow', desc: 'Watch your value grow with the community' },
];

const Home: React.FC = () => (
  <>
    {/* Hero Section */}
    <section className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-primary)] mb-4">Support What Interests You</h1>
      <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
        A frontier where creators and supporters build value together through shared ownership and goals.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
        <Button className="w-full md:w-auto">Discover Creators</Button>
        <Button variant="secondary" className="w-full md:w-auto">Start Your Outpost</Button>
      </div>
      {/* Features Section - always 3 columns on desktop, centered, visually distinct cards */}
      <div className="max-w-5xl mx-auto">
        {/* Debug: If this grid is not 3 columns on desktop, check viewport width and parent constraints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card
              key={f.title}
              className="h-full min-h-[140px] flex flex-col justify-between bg-[var(--color-surface)] shadow-lg rounded-xl p-6 text-left text-center md:text-left"
            >
              <h3 className="font-bold text-lg text-[var(--color-primary)] mb-2">{f.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm break-words">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Trending Outposts */}
    <section className="py-16 md:py-24 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Trending Outposts</h2>
      <a href="#" className="text-[var(--color-primary)] hover:underline text-sm mb-8 inline-block">View All Outposts &rarr;</a>
      {/* Placeholder for trending outposts */}
      <div className="text-[var(--color-text-muted)] italic mt-8">Trending outposts will appear here.</div>
    </section>

    {/* How Podium Nexus Works - 4 columns on desktop, number bubble, vertical stack */}
    <section className="py-16 md:py-24 bg-[var(--color-surface)] rounded-lg max-w-5xl mx-auto mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How Podium Nexus Works</h2>
      {/* Debug: If this grid is not 4 columns on desktop, check viewport width and parent constraints */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {howItWorks.map((step) => (
          <div
            key={step.step}
            className="flex flex-col items-center text-center bg-[var(--color-bg)] shadow-lg rounded-xl p-6 h-full"
          >
            <div className="w-16 aspect-square flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-bold text-2xl mb-4 border-4 border-[var(--color-surface)] shadow">
              {step.step}
            </div>
            <h4 className="font-semibold mb-2">{step.title}</h4>
            <p className="text-[var(--color-text-muted)] text-sm break-words">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default Home; 