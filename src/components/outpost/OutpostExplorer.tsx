import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import podiumProtocolService from '../../services/podiumProtocolService';

// OutpostExplorer: Lists, searches, filters, and sorts outposts
// Shows trending and leaderboards for outposts
// Debug printout for mounting and data fetching
const OutpostExplorer: React.FC = () => {
  const [outposts, setOutposts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.debug('[OutpostExplorer] Mounted');
    fetchOutposts();
  }, []);

  const fetchOutposts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await podiumProtocolService.fetchOutposts();
      setOutposts(data);
      console.debug('[OutpostExplorer] Outposts fetched:', data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch outposts');
      console.error('[OutpostExplorer] Error fetching outposts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (address: string) => {
    console.debug('[OutpostExplorer] Card clicked:', address);
    navigate(`/outposts/${address}`);
  };

  return (
    <div className="outpost-explorer">
      <h2>Discover Outposts</h2>
      {/* Search/filter/sort UI will go here */}
      {/* Trending and leaderboard sections will go here */}
      <div className="outpost-list">
        {loading && <div>Loading outposts...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && outposts.length === 0 && <div>No outposts found.</div>}
        {!loading && !error && outposts.map((outpost, idx) => (
          <div
            key={idx}
            className="outpost-card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleCardClick(outpost.address)}
          >
            {/* Replace with real outpost fields */}
            <strong>{outpost.name || 'Outpost Name'}</strong>
            <div>{outpost.description || 'Description...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutpostExplorer; 