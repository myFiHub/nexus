import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import podiumProtocolService from '../../services/podiumProtocolService';

// CreatorDetail: Shows creator info, pass/subscription options, social links, stats, and analytics
// Debug printout for mounting and data fetching
const CreatorDetail: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.debug('[CreatorDetail] Mounted');
    if (address) fetchDetail(address);
    // eslint-disable-next-line
  }, [address]);

  const fetchDetail = async (addr: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await podiumProtocolService.fetchDetail('creator', addr);
      setDetail(data);
      console.debug('[CreatorDetail] Detail fetched:', data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch creator detail');
      console.error('[CreatorDetail] Error fetching detail:', e);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder pass price/supply (should be fetched from on-chain in future)
  const passPrice = detail?.passPrice || '0.08';
  const passSupply = detail?.passSupply || 50;
  const avatar = detail?.avatar || '';
  const name = detail?.name || 'Creator Name';
  const followerCount = detail?.followerCount || 0;
  const isFollowing = false; // TODO: fetch from backend

  return (
    <div className="creator-detail">
      <h2>Creator Detail</h2>
      {loading && <div>Loading creator...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && !detail && <div>No detail found.</div>}
      {!loading && !error && detail && (
        <>
          {/* Header: avatar, name, type, follow */}
          <div className="creator-header">
            {avatar && <img src={avatar} alt={name} className="creator-avatar" />}
            <div>
              <strong>{name}</strong>
              <span className="creator-type">Creator</span>
              <span className="creator-followers">Followers: {followerCount}</span>
              <button onClick={() => alert('Follow (stub)')}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            </div>
          </div>
          {/* Price & Supply (if applicable) */}
          <div className="creator-pass-info">
            <span>Pass Price: {passPrice} MOVE</span>
            <span>Supply: {passSupply}</span>
          </div>
          {/* Trading Section */}
          <div className="creator-trading">
            <h3>Buy/Sell Pass</h3>
            <button onClick={() => alert('Buy Pass (stub)')}>Buy Pass</button>
            <button onClick={() => alert('Sell Pass (stub)')}>Sell Pass</button>
          </div>
          {/* Subscription Tiers */}
          <div className="creator-subscriptions">
            <h3>Subscription Tiers</h3>
            {/* Placeholder tiers */}
            <div>Tier 1: 0.03 MOVE/month</div>
            <div>Tier 2: 0.10 MOVE/month</div>
            <button onClick={() => alert('Subscribe (stub)')}>Subscribe</button>
          </div>
          {/* Social Links */}
          <div className="creator-social">
            <h3>Social Links</h3>
            <div>Twitter: {detail.twitter || 'N/A'}</div>
            <div>Website: {detail.website || 'N/A'}</div>
            {/* More social links here */}
          </div>
          {/* Participation/Activity */}
          <div className="creator-activity">
            <h3>Participation & Activity</h3>
            <div>Active Outposts: {detail.activeOutposts || 0}</div>
            <div>Recent Cheers: {detail.cheers || 0}</div>
            <div>Recent Boos: {detail.boos || 0}</div>
            {/* More participation/activity info here */}
          </div>
          {/* Analytics/Stats */}
          <div className="creator-analytics">
            <h3>Analytics & Stats</h3>
            <div>Trading Volume: {detail.tradingVolume || '0'} MOVE</div>
            <div>Pass Holders: {detail.passHolders || 0}</div>
            {/* More analytics/stats here */}
          </div>
        </>
      )}
    </div>
  );
};

export default CreatorDetail; 