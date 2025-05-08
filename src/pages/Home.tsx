import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-podium-page-bg text-podium-primary-text">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">
            Support What Interests You
          </h1>
          <p className="text-xl text-podium-primary-text mb-8">
            A frontier where creators and supporters build value together through shared ownership and goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/creators" className="btn-primary px-8 py-3 text-lg">Discover Creators</Link>
            <Link to="/outposts/new" className="btn-secondary px-8 py-3 text-lg border border-fuchsia-500">Start Your Outpost</Link>
          </div>
        </div>
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-fuchsia-400 mb-4">Lifetime Value</h3>
            <p>Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-fuchsia-400 mb-4">Direct Support</h3>
            <p>Skip the middleman. Support creators directly while participating in their growth through smart contracts.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-fuchsia-400 mb-4">Community Owned</h3>
            <p>Join exclusive outposts where creators and fans build value together through transparent tokenomics.</p>
          </div>
        </div>
      </div>
      {/* Trending Outposts Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-4">Trending Outposts</h2>
        <div className="text-center mb-8">
          <Link to="/explorer" className="text-fuchsia-400 hover:underline font-semibold">View All Outposts →</Link>
        </div>
        {/* Placeholder for trending outposts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
            <div key={i} className="card p-6">
              <h3 className="text-lg font-semibold mb-2">Outpost {i}</h3>
              <p className="text-podium-primary-text">Description for trending outpost {i}.</p>
            </div>
          ))}
        </div>
      </div>
      {/* How Podium Nexus Works Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">How Podium Nexus Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: 'Connect', desc: 'Sign in with your social account or wallet.' },
            { title: 'Discover', desc: 'Find creators you want to support.' },
            { title: 'Support', desc: 'Buy passes and join exclusive communities.' },
            { title: 'Grow', desc: 'Watch your value grow with the community.' },
          ].map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="bg-fuchsia-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">{idx+1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-center text-podium-primary-text text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 