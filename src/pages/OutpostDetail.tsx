import React, { useState, useEffect } from 'react';
import OutpostHeader from '../components/outpost/OutpostHeader';
import PassTrading from '../components/outpost/PassTrading';
import SubscriptionTiers from '../components/outpost/SubscriptionTiers';
import CommunityFeed from '../components/outpost/CommunityFeed';
import Skeleton from '../components/common/Skeleton';
import { useParams } from 'react-router-dom';

// Mock outpost detail data (structure matches OutpostData from ARCHITECTURE.md)
const mockOutpost = {
  address: '0x1',
  owner: '0xabc',
  name: 'CryptoCat',
  avatar: '😺',
  uri: '',
  createdAt: 1710000000,
  paused: false,
  passConfig: { initialPrice: 0.42, weightB: 1, creatorFee: 5, referralFee: 2, protocolFee: 1 },
  tiers: [
    { id: 1, name: 'Bronze', price: 0.05, duration: 30, maxSupply: 1000, benefits: ['Basic content'] },
    { id: 2, name: 'Silver', price: 0.15, duration: 90, maxSupply: 500, benefits: ['All Bronze', 'Early access'] },
    { id: 3, name: 'Gold', price: 0.5, duration: 365, maxSupply: 100, benefits: ['All Silver', '1:1 chat'] },
  ],
  stats: { totalSupply: 1200, holders: 1200, volume24h: 12.3, price: 0.42, marketCap: 504 },
};

/**
 * OutpostDetail page: detailed view for a single outpost
 */
const OutpostDetail: React.FC = () => {
  const { address } = useParams();
  const [loading, setLoading] = useState(true);
  const [outpost, setOutpost] = useState<any>(null);

  useEffect(() => {
    // Simulate async fetch
    setLoading(true);
    setTimeout(() => {
      setOutpost(mockOutpost);
      setLoading(false);
    }, 800);
  }, [address]);

  console.debug('[OutpostDetail] Rendering OutpostDetail page', { address });

  if (loading || !outpost) {
    return <Skeleton height={400} />;
  }

  return (
    <div className="container py-10">
      <OutpostHeader outpost={outpost} />
      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <PassTrading outpost={outpost} />
          <CommunityFeed outpost={outpost} />
        </div>
        <div>
          <SubscriptionTiers tiers={outpost.tiers} />
        </div>
      </div>
    </div>
  );
};

export default OutpostDetail; 