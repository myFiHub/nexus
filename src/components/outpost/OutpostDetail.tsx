import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import podiumProtocolService from '../../services/podiumProtocolService';

// OutpostDetail: Shows outpost info, price chart, pass trading, subscription options, analytics, and stats
// Debug printout for mounting and data fetching
const OutpostDetail: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.debug('[OutpostDetail] Mounted');
    if (address) fetchDetail(address);
    // eslint-disable-next-line
  }, [address]);

  const fetchDetail = async (addr: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await podiumProtocolService.fetchDetail('outpost', addr);
      setDetail(data);
      console.debug('[OutpostDetail] Detail fetched:', data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch outpost detail');
      console.error('[OutpostDetail] Error fetching detail:', e);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder pass price/supply (should be fetched from on-chain in future)
  const passPrice = detail?.passPrice || '0.10';
  const passSupply = detail?.passSupply || 100;
  const avatar = detail?.avatar || '';
  const name = detail?.name || 'Outpost Name';
  const followerCount = detail?.followerCount || 0;
  const isFollowing = false; // TODO: fetch from backend

  return (
    <div className="outpost-detail">
      <h2>Outpost Detail</h2>
      {loading && <div>Loading outpost...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && !detail && <div>No detail found.</div>}
      {!loading && !error && detail && (
        <>
          {/* Header: avatar, name, type, follow */}
          <div className="outpost-header">
            {avatar && <img src={avatar} alt={name} className="outpost-avatar" />}
            <div>
              <strong>{name}</strong>
              <span className="outpost-type">Outpost</span>
              <span className="outpost-followers">Followers: {followerCount}</span>
              <button onClick={() => alert('Follow (stub)')}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            </div>
          </div>
          {/* Price & Supply */}
          <div className="outpost-pass-info">
            <span>Pass Price: {passPrice} MOVE</span>
            <span>Supply: {passSupply}</span>
          </div>
          {/* Trading Section */}
          <div className="outpost-trading">
            <h3>Buy/Sell Pass</h3>
            <button onClick={() => alert('Buy Pass (stub)')}>Buy Pass</button>
            <button onClick={() => alert('Sell Pass (stub)')}>Sell Pass</button>
          </div>
          {/* Subscription Tiers */}
          <div className="outpost-subscriptions">
            <h3>Subscription Tiers</h3>
            {/* Placeholder tiers */}
            <div>Tier 1: 0.05 MOVE/month</div>
            <div>Tier 2: 0.15 MOVE/month</div>
            <button onClick={() => alert('Subscribe (stub)')}>Subscribe</button>
          </div>
          {/* Participation/Activity */}
          <div className="outpost-activity">
            <h3>Participation & Activity</h3>
            <div>Active Members: {detail.activeCount || 0}</div>
            <div>Recent Cheers: {detail.cheers || 0}</div>
            <div>Recent Boos: {detail.boos || 0}</div>
            {/* More participation/activity info here */}
          </div>
          {/* Analytics/Stats */}
          <div className="outpost-analytics">
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

export default OutpostDetail; 