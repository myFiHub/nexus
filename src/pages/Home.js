import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Support What Interests You
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            A frontier where creators and supporters build value together through shared ownership and goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/explore" 
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
            >
              Discover Creators
            </Link>
            <Link 
              to="/create" 
              className="px-8 py-3 bg-transparent border-2 border-purple-600 hover:bg-purple-600/20 rounded-lg font-semibold transition-all"
            >
              Start Your Outpost
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Lifetime Value</h3>
            <p className="text-gray-300">
              Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Direct Support</h3>
            <p className="text-gray-300">
              Skip the middleman. Support creators directly while participating in their growth through smart contracts.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Community Owned</h3>
            <p className="text-gray-300">
              Join exclusive outposts where creators and fans build value together through transparent tokenomics.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Trending Outposts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Creator Cards will be dynamically populated */}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/explore" 
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            View All Outposts →
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">How Podium Nexus Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-gray-400">Sign in with your social account or wallet</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Discover</h3>
            <p className="text-gray-400">Find creators you want to support</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-gray-400">Buy passes and join exclusive communities</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Grow</h3>
            <p className="text-gray-400">Watch your value grow with the community</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Join the Future?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Be among the first to shape the future of creator economy
        </p>
        <Link 
          to="/explore" 
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all inline-block"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default Home; 