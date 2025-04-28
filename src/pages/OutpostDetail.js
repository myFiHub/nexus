import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function OutpostDetail() {
  const { address } = useParams();
  const {
    walletState,
    isConnected,
    isLoading,
    error,
    buyPass,
    sellPass,
    fetchOutposts
  } = useApp();
  
  const [outpost, setOutpost] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock subscription tiers
  const subscriptionTiers = [
    {
      id: 1,
      name: 'Basic',
      price: 5,
      benefits: [
        'Access to basic content',
        'Community forum access',
        'Monthly newsletter'
      ]
    },
    {
      id: 2,
      name: 'Premium',
      price: 15,
      benefits: [
        'Access to all content',
        'Priority support',
        'Exclusive community events',
        'Early access to new features'
      ]
    },
    {
      id: 3,
      name: 'VIP',
      price: 50,
      benefits: [
        'All Premium benefits',
        '1-on-1 consultation',
        'Custom content requests',
        'Direct messaging with creator'
      ]
    }
  ];
  
  // Fetch outpost details
  useEffect(() => {
    const fetchOutpostDetails = async () => {
      try {
        // In a real implementation, this would fetch from an API
        const outposts = await fetchOutposts();
        const foundOutpost = outposts.find(o => o.address === address);
        
        if (foundOutpost) {
          setOutpost({
            ...foundOutpost,
            currentPrice: 100000000, // 1 APT in OCTA units
            holders: 125,
            createdAt: '2023-01-15',
            category: 'education',
            image: 'https://via.placeholder.com/800x400',
            description: 'This is a detailed description of the outpost. It provides more information about what the outpost offers and what users can expect when they join.',
            creator: {
              name: 'Creator123',
              avatar: 'https://via.placeholder.com/150',
              bio: 'Content creator and community builder on Podium Nexus.'
            },
            stats: {
              totalRevenue: 1250000000, // 12.5 APT
              totalPasses: 125,
              averageHoldingTime: '45 days'
            }
          });
          
          // If user is connected, fetch their balance
          if (isConnected) {
            // Mock balance
            setUserBalance(5);
          }
        }
      } catch (error) {
        console.error('Error fetching outpost details:', error);
      }
    };
    
    fetchOutpostDetails();
  }, [address, fetchOutposts, isConnected]);
  
  // Handle buy pass
  const handleBuyPass = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      setIsBuying(true);
      setTransactionHash('');
      
      // In a real implementation, this would call the buyPass function
      // const hash = await buyPass(address, buyAmount);
      
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      setTransactionHash(hash);
      setUserBalance(prev => prev + buyAmount);
    } catch (error) {
      console.error('Error buying pass:', error);
      alert('Failed to buy pass: ' + error.message);
    } finally {
      setIsBuying(false);
    }
  };
  
  // Handle sell pass
  const handleSellPass = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (sellAmount > userBalance) {
      alert('You cannot sell more passes than you own');
      return;
    }
    
    try {
      setIsSelling(true);
      setTransactionHash('');
      
      // In a real implementation, this would call the sellPass function
      // const hash = await sellPass(address, sellAmount);
      
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      
      setTransactionHash(hash);
      setUserBalance(prev => prev - sellAmount);
    } catch (error) {
      console.error('Error selling pass:', error);
      alert('Failed to sell pass: ' + error.message);
    } finally {
      setIsSelling(false);
    }
  };
  
  // Handle subscribe
  const handleSubscribe = (tierId) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    alert(`Subscribing to ${subscriptionTiers.find(t => t.id === tierId).name} tier`);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-podium-primary-blue mx-auto"></div>
        <p className="text-podium-text mt-4">Loading outpost details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (!outpost) {
    return (
      <div className="text-center py-12">
        <svg 
          className="h-16 w-16 text-podium-secondary-text mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-podium-text text-xl">Outpost not found</p>
        <p className="text-podium-secondary-text">The outpost you're looking for doesn't exist or has been removed.</p>
        <Link to="/outposts" className="btn-primary mt-4 inline-block">
          Back to Outposts
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {outpost.creator.name}
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Join an exclusive community of supporters and be part of this creator's journey.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{outpost.holders}</div>
                <div className="text-gray-400">Holders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24.5K</div>
                <div className="text-gray-400">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">+15%</div>
                <div className="text-gray-400">Growth</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                onClick={handleBuyPass}
                disabled={isBuying}
              >
                {isBuying ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Processing...
                  </>
                ) : 'Buy Pass'}
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-purple-600 hover:bg-purple-600/20 rounded-lg font-semibold transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Creator Image/Media */}
            <div className="aspect-square rounded-2xl bg-gray-800 overflow-hidden">
              {outpost.image && (
                <img 
                  src={outpost.image} 
                  alt={outpost.name} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Price Chart Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Pass Price History</h2>
          <div className="h-64 bg-gray-900 rounded-lg">
            {/* Price Chart will be dynamically populated */}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-400">Current Price</div>
              <div className="text-xl font-bold">
                {(outpost.currentPrice / 100000000).toFixed(4)} APT
              </div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-400">24h Change</div>
              <div className="text-xl font-bold text-green-400">+12.5%</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-400">Market Cap</div>
              <div className="text-xl font-bold">45.2K MOVE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'overview'
                ? 'bg-purple-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'benefits'
                ? 'bg-purple-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('benefits')}
          >
            Benefits
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'community'
                ? 'bg-purple-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('community')}
          >
            Community
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold mb-4">About This Outpost</h3>
              <p className="text-gray-300 mb-6">
                Join an exclusive community of supporters and gain access to unique content, experiences, and opportunities. As an early supporter, you'll benefit from the bonding curve pricing mechanism and watch your investment grow with the community.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2">What You Get</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Exclusive content access</li>
                    <li>• Community membership</li>
                    <li>• Early access to new releases</li>
                    <li>• Voting rights on future projects</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2">Creator Stats</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {outpost.holders} holders</li>
                    <li>• 100+ exclusive posts</li>
                    <li>• 1K+ active community members</li>
                    <li>• 4.9/5 community rating</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Pass Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2">Exclusive Access</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Private content library</li>
                    <li>• Behind-the-scenes content</li>
                    <li>• Early access to new releases</li>
                    <li>• Exclusive community events</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2">Community Benefits</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Private Discord access</li>
                    <li>• Community voting rights</li>
                    <li>• Direct creator interaction</li>
                    <li>• Collaborative opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Community Highlights</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Community Activity Cards will be dynamically populated */}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Be among the first to support this creator and watch your investment grow
        </p>
        <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all">
          Buy Pass Now
        </button>
      </section>
    </div>
  );
}

export default OutpostDetail; 