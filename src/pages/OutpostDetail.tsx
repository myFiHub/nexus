import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const mockOutpost = {
  name: 'Creator Alpha',
  image: 'https://via.placeholder.com/800x400',
  category: 'Education',
  description: 'This is a detailed description of the outpost. It provides more information about what the outpost offers and what users can expect when they join.',
  creator: {
    name: 'Creator123',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Content creator and community builder on Podium Nexus.',
  },
  stats: {
    price: 100000000,
    holders: 125,
    totalRevenue: 1250000000,
    totalPasses: 125,
    averageHoldingTime: '45 days',
  },
};

const subscriptionTiers = [
  {
    id: 1,
    name: 'Basic',
    price: 5,
    benefits: [
      'Access to basic content',
      'Community forum access',
      'Monthly newsletter',
    ],
  },
  {
    id: 2,
    name: 'Premium',
    price: 15,
    benefits: [
      'Access to all content',
      'Priority support',
      'Exclusive community events',
      'Early access to new features',
    ],
  },
  {
    id: 3,
    name: 'VIP',
    price: 50,
    benefits: [
      'All Premium benefits',
      '1-on-1 consultation',
      'Custom content requests',
      'Direct messaging with creator',
    ],
  },
];

const OutpostDetail: React.FC = () => {
  const [userBalance, setUserBalance] = useState(2);
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionHash, setTransactionHash] = useState('');

  // Handlers (mocked)
  const handleBuyPass = () => {
    setIsBuying(true);
    setTimeout(() => {
      setUserBalance((b) => b + buyAmount);
      setTransactionHash('0x123...buy');
      setIsBuying(false);
    }, 1000);
  };
  const handleSellPass = () => {
    if (sellAmount > userBalance) return;
    setIsSelling(true);
    setTimeout(() => {
      setUserBalance((b) => b - sellAmount);
      setTransactionHash('0x123...sell');
      setIsSelling(false);
    }, 1000);
  };
  const handleSubscribe = (tierId: number) => {
    alert(`Subscribing to ${subscriptionTiers.find((t) => t.id === tierId)?.name} tier`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <Card className="p-0 overflow-hidden">
        <img src={mockOutpost.image} alt={mockOutpost.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">{mockOutpost.name}</h1>
              <span className="inline-block bg-[var(--color-surface)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                {mockOutpost.category}
              </span>
              <p className="text-[var(--color-text-muted)] mb-2">{mockOutpost.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={mockOutpost.creator.avatar} alt={mockOutpost.creator.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="font-bold">{mockOutpost.creator.name}</div>
                <div className="text-[var(--color-text-muted)] text-sm">{mockOutpost.creator.bio}</div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div>
              <div className="text-lg font-bold">{mockOutpost.stats.price / 100000000} APT</div>
              <div className="text-[var(--color-text-muted)] text-xs">Current Price</div>
            </div>
            <div>
              <div className="text-lg font-bold">{mockOutpost.stats.holders}</div>
              <div className="text-[var(--color-text-muted)] text-xs">Holders</div>
            </div>
            <div>
              <div className="text-lg font-bold">{mockOutpost.stats.totalRevenue / 100000000} APT</div>
              <div className="text-[var(--color-text-muted)] text-xs">Total Revenue</div>
            </div>
            <div>
              <div className="text-lg font-bold">{mockOutpost.stats.totalPasses}</div>
              <div className="text-[var(--color-text-muted)] text-xs">Total Passes</div>
            </div>
            <div>
              <div className="text-lg font-bold">{mockOutpost.stats.averageHoldingTime}</div>
              <div className="text-[var(--color-text-muted)] text-xs">Avg. Holding Time</div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-4 border-b border-[var(--color-surface)] mb-6">
            {['overview', 'passes', 'subscriptions', 'activity'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${activeTab === tab ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)]'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-[var(--color-text-muted)] mb-4">{mockOutpost.description}</p>
            </div>
          )}
          {activeTab === 'passes' && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="font-bold mb-2">Buy Passes</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    type="number"
                    min={1}
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(Number(e.target.value))}
                    className="w-24"
                  />
                  <Button onClick={handleBuyPass} disabled={isBuying}>
                    {isBuying ? 'Buying...' : 'Buy'}
                  </Button>
                </div>
                <h3 className="font-bold mb-2 mt-6">Sell Passes</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    type="number"
                    min={1}
                    value={sellAmount}
                    onChange={(e) => setSellAmount(Number(e.target.value))}
                    className="w-24"
                  />
                  <Button onClick={handleSellPass} disabled={isSelling || sellAmount > userBalance}>
                    {isSelling ? 'Selling...' : 'Sell'}
                  </Button>
                </div>
                <div className="text-[var(--color-text-muted)] text-sm">Your Balance: {userBalance}</div>
                {transactionHash && (
                  <div className="text-[var(--color-success)] text-xs mt-2">Transaction: {transactionHash}</div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'subscriptions' && (
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <Card key={tier.id} className="bg-[var(--color-bg)]">
                  <h4 className="font-bold text-lg mb-2 text-[var(--color-primary)]">{tier.name}</h4>
                  <div className="text-2xl font-bold mb-2">{tier.price} APT/mo</div>
                  <ul className="mb-4 text-[var(--color-text-muted)] text-sm space-y-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                  <Button onClick={() => handleSubscribe(tier.id)} className="w-full">Subscribe</Button>
                </Card>
              ))}
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="text-[var(--color-text-muted)]">Recent activity will appear here.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OutpostDetail; 