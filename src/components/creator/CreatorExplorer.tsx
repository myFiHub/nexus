import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import podiumProtocolService from '../../services/podiumProtocolService';

// CreatorExplorer: Lists, searches, filters, and sorts creators
// Shows trending and leaderboards for creators
// Debug printout for mounting and data fetching
const CreatorExplorer: React.FC = () => {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.debug('[CreatorExplorer] Mounted');
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await podiumProtocolService.fetchCreators();
      setCreators(data);
      console.debug('[CreatorExplorer] Creators fetched:', data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch creators');
      console.error('[CreatorExplorer] Error fetching creators:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (address: string) => {
    console.debug('[CreatorExplorer] Card clicked:', address);
    navigate(`/creators/${address}`);
  };

  return (
    <div className="creator-explorer">
      <h2>Discover Creators</h2>
      {/* Search/filter/sort UI will go here */}
      {/* Trending and leaderboard sections will go here */}
      <div className="creator-list">
        {loading && <div>Loading creators...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && creators.length === 0 && <div>No creators found.</div>}
        {!loading && !error && creators.map((creator, idx) => (
          <div
            key={idx}
            className="creator-card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleCardClick(creator.address)}
          >
            {/* Replace with real creator fields */}
            <strong>{creator.name || 'Creator Name'}</strong>
            <div>{creator.description || 'Description...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorExplorer; 