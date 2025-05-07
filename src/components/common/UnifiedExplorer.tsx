import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchCreatorsAsync } from '../../redux/slices/creatorSlice';
import { fetchOutpostsAsync } from '../../redux/slices/outpostSlice';
import ExplorerCard from './ExplorerCard';

// UnifiedExplorer: Shows all, outposts, or creators with filter/tabs
const UnifiedExplorer: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'outposts' | 'creators'>('all');
  const dispatch = useDispatch();
  // Redux state for creators
  const creators = useSelector((state: RootState) => state.creators.items);
  const creatorsLoading = useSelector((state: RootState) => state.creators.loading);
  const creatorsError = useSelector((state: RootState) => state.creators.error);
  // Redux state for outposts
  const outposts = useSelector((state: RootState) => state.outposts.items);
  const outpostsLoading = useSelector((state: RootState) => state.outposts.loading);
  const outpostsError = useSelector((state: RootState) => state.outposts.error);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch creators and outposts from Redux on mount
    dispatch(fetchCreatorsAsync() as any);
    dispatch(fetchOutpostsAsync() as any);
    console.debug('[UnifiedExplorer] Mounted and fetching creators/outposts');
  }, [dispatch]);

  // Combine for "all" tab, mapping fields for ExplorerCard
  const allItems = [
    ...outposts.map((o) => ({
      ...o,
      type: 'outpost' as const,
      avatar: o.uri || undefined,
      followerCount: o.stats?.holders,
      activeCount: o.stats?.totalSupply,
      passPrice: o.stats?.price,
      passSupply: o.stats?.totalSupply,
    })),
    ...creators.map((c) => ({
      ...c,
      type: 'creator' as const,
      avatar: c.uri || undefined,
      followerCount: c.stats?.holders,
      activeCount: c.stats?.totalSupply,
      passPrice: c.stats?.price,
      passSupply: c.stats?.totalSupply,
    })),
  ];
  const items = tab === 'all'
    ? allItems
    : tab === 'outposts'
      ? outposts.map((o) => ({
          ...o,
          type: 'outpost' as const,
          avatar: o.uri || undefined,
          followerCount: o.stats?.holders,
          activeCount: o.stats?.totalSupply,
          passPrice: o.stats?.price,
          passSupply: o.stats?.totalSupply,
        }))
      : creators.map((c) => ({
          ...c,
          type: 'creator' as const,
          avatar: c.uri || undefined,
          followerCount: c.stats?.holders,
          activeCount: c.stats?.totalSupply,
          passPrice: c.stats?.price,
          passSupply: c.stats?.totalSupply,
        }));

  useEffect(() => {
    console.debug('[UnifiedExplorer] Tab changed:', tab);
  }, [tab]);

  useEffect(() => {
    console.debug('[UnifiedExplorer] Creators updated:', creators);
  }, [creators]);

  useEffect(() => {
    console.debug('[UnifiedExplorer] Outposts updated:', outposts);
  }, [outposts]);

  // Show loading if either creators or outposts are loading
  const loading = creatorsLoading || outpostsLoading;
  // Show error if either creators or outposts have error
  const error = creatorsError || outpostsError;

  return (
    <div className="unified-explorer">
      <h2>Explore</h2>
      <div className="explorer-tabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All</button>
        <button className={tab === 'outposts' ? 'active' : ''} onClick={() => setTab('outposts')}>Outposts</button>
        <button className={tab === 'creators' ? 'active' : ''} onClick={() => setTab('creators')}>Creators</button>
      </div>
      <div className="explorer-list">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && items.length === 0 && <div>No items found.</div>}
        {!loading && !error && items.map((item, idx) => (
          <ExplorerCard
            key={item.address || idx}
            type={item.type}
            name={item.name}
            avatar={item.avatar}
            followerCount={item.followerCount}
            activeCount={item.activeCount}
            passPrice={item.passPrice}
            passSupply={item.passSupply}
            onView={() => navigate(`/${item.type === 'outpost' ? 'outposts' : 'creators'}/${item.address}`)}
            onBuyPass={item.type === 'outpost' ? () => alert('Buy Pass (stub)') : undefined}
            onFollow={() => alert('Follow (stub)')}
          />
        ))}
      </div>
    </div>
  );
};

export default UnifiedExplorer; 