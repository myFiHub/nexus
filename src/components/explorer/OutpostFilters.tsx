import React from 'react';
import Select from '../common/Select';

/**
 * OutpostFilters props
 */
type OutpostFiltersProps = {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
};

/**
 * OutpostFilters: filter controls for the Explorer page
 */
const OutpostFilters: React.FC<OutpostFiltersProps> = ({ filters, setFilters }) => {
  // Handlers for filter changes
  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-4">
      <Select
        value={filters.category || ''}
        onChange={e => handleChange('category', e.target.value)}
        aria-label="Category"
      >
        <option value="">All Categories</option>
        <option value="art">Art</option>
        <option value="gaming">Gaming</option>
        <option value="music">Music</option>
      </Select>
      <Select
        value={filters.trending || ''}
        onChange={e => handleChange('trending', e.target.value)}
        aria-label="Trending"
      >
        <option value="">All</option>
        <option value="trending">Trending</option>
        <option value="new">New</option>
      </Select>
      <Select
        value={filters.price || ''}
        onChange={e => handleChange('price', e.target.value)}
        aria-label="Price"
      >
        <option value="">Any Price</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </Select>
    </div>
  );
};

export default OutpostFilters; 