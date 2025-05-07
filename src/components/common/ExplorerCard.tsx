import React from 'react';

interface ExplorerCardProps {
  type: 'creator' | 'outpost';
  name: string;
  avatar?: string;
  followerCount?: number;
  activeCount?: number;
  passPrice?: string;
  passSupply?: number;
  onView?: () => void;
  onBuyPass?: () => void;
  onFollow?: () => void;
}

// ExplorerCard: Reusable card for creators and outposts
// Shows avatar, name, type, stats, and action buttons
const ExplorerCard: React.FC<ExplorerCardProps> = ({
  type,
  name,
  avatar,
  followerCount,
  activeCount,
  passPrice,
  passSupply,
  onView,
  onBuyPass,
  onFollow,
}) => {
  return (
    <div className="explorer-card">
      <div className="explorer-card-header">
        {avatar && <img src={avatar} alt={name} className="explorer-card-avatar" />}
        <div>
          <strong>{name}</strong>
          <span className="explorer-card-type">{type === 'creator' ? 'Creator' : 'Outpost'}</span>
        </div>
      </div>
      <div className="explorer-card-stats">
        {typeof followerCount === 'number' && <span>Followers: {followerCount}</span>}
        {typeof activeCount === 'number' && <span>Active: {activeCount}</span>}
        {typeof passPrice === 'string' && <span>Pass Price: {passPrice}</span>}
        {typeof passSupply === 'number' && <span>Supply: {passSupply}</span>}
      </div>
      <div className="explorer-card-actions">
        {onView && <button onClick={onView}>View</button>}
        {onBuyPass && <button onClick={onBuyPass}>Buy Pass</button>}
        {onFollow && <button onClick={onFollow}>Follow</button>}
      </div>
    </div>
  );
};

export default ExplorerCard; 