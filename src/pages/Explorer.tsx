import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';

const mockOutposts = [
  {
    id: '1',
    name: 'Creator Alpha',
    description: 'Education and community building.',
    category: 'education',
    holders: 120,
    currentPrice: 100000000,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Gamer Guild',
    description: 'Gaming tournaments and streams.',
    category: 'gaming',
    holders: 300,
    currentPrice: 150000000,
    createdAt: '2024-02-01',
  },
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'technology', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
];

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

const Explorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter and sort outposts
  const filteredOutposts = mockOutposts
    .filter((outpost) => {
      const matchesSearch =
        outpost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outpost.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || outpost.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
    <Layout>
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">Discover Creator Communities</h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-2">
          Find and support creators you believe in. Early supporters gain exclusive access to content, experiences, and community benefits.
        </p>
        <p className="text-lg text-[var(--color-text-muted)] mt-2 max-w-2xl mx-auto">
          Support what you love today, with the flexibility to transfer or sell your passes if your interests change.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search outposts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <span className="absolute right-3 top-2.5 text-[var(--color-text-muted)]">🔍</span>
          </div>
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-48"
          />
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          {['all', 'trending', 'new'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'primary' : 'secondary'}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Communities */}
      <section className="mb-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Featured Communities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example featured cards */}
          {filteredOutposts.slice(0, 3).map((outpost) => (
            <Card key={outpost.id} className="text-left">
              <h3 className="font-bold text-lg text-[var(--color-primary)] mb-2">{outpost.name}</h3>
              <p className="text-[var(--color-text-muted)] mb-2">{outpost.description}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Holders: {outpost.holders}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Price: {outpost.currentPrice / 100000000} APT</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="mb-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.filter((c) => c.id !== 'all').map((cat) => (
            <Card key={cat.id} className="text-center cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              <h3 className="font-semibold">{cat.name}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Types of Experiences */}
      <section className="mb-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Types of Experiences</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)]">Social Clubs</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              Join exclusive communities where like-minded fans connect, share, and engage with creators.
            </p>
            <ul className="space-y-2 text-[var(--color-text-muted)] text-sm">
              <li>• Private Discord servers</li>
              <li>• Community events</li>
              <li>• Fan meetups</li>
              <li>• Collaborative projects</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)]">Master Classes</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              Access premium educational content, workshops, and tutorials from experts in their field.
            </p>
            <ul className="space-y-2 text-[var(--color-text-muted)] text-sm">
              <li>• Video tutorials</li>
              <li>• Live workshops</li>
              <li>• Q&A sessions</li>
              <li>• Resource libraries</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)]">Exclusive Drops</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              Get early access to limited edition content, merch, and digital collectibles.
            </p>
            <ul className="space-y-2 text-[var(--color-text-muted)] text-sm">
              <li>• NFT drops</li>
              <li>• Merch releases</li>
              <li>• Early content access</li>
              <li>• Giveaways</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Outpost/Creator List */}
      <section className="mb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">All Communities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutposts.map((outpost) => (
            <Card key={outpost.id} className="text-left">
              <h3 className="font-bold text-lg text-[var(--color-primary)] mb-2">{outpost.name}</h3>
              <p className="text-[var(--color-text-muted)] mb-2">{outpost.description}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Holders: {outpost.holders}</p>
              <p className="text-[var(--color-text-muted)] text-sm">Price: {outpost.currentPrice / 100000000} APT</p>
              <Button className="mt-2 w-full">View Details</Button>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Explorer; 