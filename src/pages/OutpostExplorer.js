import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OutpostExplorer = () => {
  const {
    outposts,
    isLoading,
    error,
    fetchOutposts
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'education', name: 'Education' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' }
  ];
  
  // Mock sort options
  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ];
  
  // Fetch outposts on component mount
  useEffect(() => {
    fetchOutposts();
  }, [fetchOutposts]);
  
  // Filter and sort outposts
  const filteredOutposts = outposts
    .filter(outpost => {
      // Filter by search term
      const matchesSearch = outpost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           outpost.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || outpost.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'popular':
        default:
          return b.holders - a.holders;
      }
    });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Creator Communities
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find and support creators you believe in. Early supporters gain exclusive access to content, experiences, and community benefits.
          </p>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Support what you love today, with the flexibility to transfer or sell your passes if your interests change.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search outposts..."
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === 'all'
                    ? 'bg-purple-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === 'trending'
                    ? 'bg-purple-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('trending')}
              >
                Trending
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === 'new'
                    ? 'bg-purple-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('new')}
              >
                New
              </button>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Communities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Outpost Cards will be dynamically populated */}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/explore?category=music"
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-center"
            >
              <span className="text-2xl mb-2 block">🎵</span>
              <h3 className="font-semibold">Music</h3>
            </Link>
            <Link
              to="/explore?category=art"
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-center"
            >
              <span className="text-2xl mb-2 block">🎨</span>
              <h3 className="font-semibold">Art</h3>
            </Link>
            <Link
              to="/explore?category=education"
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-center"
            >
              <span className="text-2xl mb-2 block">📚</span>
              <h3 className="font-semibold">Education</h3>
            </Link>
            <Link
              to="/explore?category=gaming"
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-center"
            >
              <span className="text-2xl mb-2 block">🎮</span>
              <h3 className="font-semibold">Gaming</h3>
            </Link>
          </div>
        </div>

        {/* Experience Types Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Types of Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Social Clubs</h3>
              <p className="text-gray-300 mb-4">
                Join exclusive communities where like-minded fans connect, share, and engage with creators.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Private Discord servers</li>
                <li>• Community events</li>
                <li>• Fan meetups</li>
                <li>• Collaborative projects</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Master Classes</h3>
              <p className="text-gray-300 mb-4">
                Access premium educational content, workshops, and tutorials from experts in their field.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Video tutorials</li>
                <li>• Live workshops</li>
                <li>• Q&A sessions</li>
                <li>• Course materials</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Entertainment</h3>
              <p className="text-gray-300 mb-4">
                Enjoy exclusive performances, comedy shows, and entertainment experiences.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Virtual concerts</li>
                <li>• Comedy shows</li>
                <li>• Behind-the-scenes</li>
                <li>• Early access content</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flexibility Section */}
        <div className="mb-12 p-8 bg-gray-800 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Flexible Support</h2>
              <p className="text-gray-300 mb-4">
                Your interests may change over time. That's why we've built flexibility into our platform:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Support creators you love today</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Transfer passes to friends who might enjoy them more</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Sell your passes if your interests change</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>No long-term commitments required</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-6xl">🔄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Creators Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Creators</h2>
            <Link
              to="/explore/trending"
              className="text-purple-400 hover:text-purple-300"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trending Creator Cards will be dynamically populated */}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Community?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the next generation of creator economy
          </p>
          <Link
            to="/create"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all inline-block"
          >
            Start Your Outpost
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OutpostExplorer; 