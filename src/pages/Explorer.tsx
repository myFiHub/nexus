import React, { useState } from 'react';
import OutpostFilters from '../components/explorer/OutpostFilters';
import SearchBar from '../components/common/SearchBar';
import OutpostGrid from '../components/explorer/OutpostGrid';

// Mock outpost data (structure matches OutpostData from ARCHITECTURE.md)
const mockOutposts = [
  {
    address: '0x1',
    owner: '0xabc',
    name: 'CryptoCat',
    uri: '',
    createdAt: 1710000000,
    paused: false,
    passConfig: { initialPrice: 0.42, weightB: 1, creatorFee: 5, referralFee: 2, protocolFee: 1 },
    tiers: [],
    stats: { totalSupply: 1200, holders: 1200, volume24h: 12.3, price: 0.42, marketCap: 504 },
  },
  {
    address: '0x2',
    owner: '0xdef',
    name: 'ArtByAda',
    uri: '',
    createdAt: 1710000001,
    paused: false,
    passConfig: { initialPrice: 0.31, weightB: 1, creatorFee: 5, referralFee: 2, protocolFee: 1 },
    tiers: [],
    stats: { totalSupply: 980, holders: 980, volume24h: 8.7, price: 0.31, marketCap: 303.8 },
  },
  // ...more mock outposts
];

/**
 * Explorer page: grid of outposts with filters and search
 */
const Explorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  // Filter and search logic (mock)
  const filteredOutposts = mockOutposts.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  console.debug('[Explorer] Rendering Explorer page');
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <OutpostFilters filters={filters} setFilters={setFilters} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search outposts..." />
      </div>
      <OutpostGrid outposts={filteredOutposts} />
    </div>
  );
};

export default Explorer; 