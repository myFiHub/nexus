import React, { useState } from 'react';

// ExplorerTabs: Tab navigation for switching between Outposts and Creators
// Debug printout for tab changes
const ExplorerTabs: React.FC<{
  outpostComponent: React.ReactNode;
  creatorComponent: React.ReactNode;
}> = ({ outpostComponent, creatorComponent }) => {
  const [tab, setTab] = useState<'outposts' | 'creators'>('outposts');

  const handleTabChange = (newTab: 'outposts' | 'creators') => {
    setTab(newTab);
    console.debug(`[ExplorerTabs] Switched to ${newTab}`);
  };

  return (
    <div className="explorer-tabs">
      <div className="tab-header">
        <button
          className={tab === 'outposts' ? 'active' : ''}
          onClick={() => handleTabChange('outposts')}
        >
          Outposts
        </button>
        <button
          className={tab === 'creators' ? 'active' : ''}
          onClick={() => handleTabChange('creators')}
        >
          Creators
        </button>
      </div>
      <div className="tab-content">
        {tab === 'outposts' ? outpostComponent : creatorComponent}
      </div>
    </div>
  );
};

export default ExplorerTabs; 