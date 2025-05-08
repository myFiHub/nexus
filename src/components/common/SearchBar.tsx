import React from 'react';
import Input from './Input';

/**
 * SearchBar component props
 */
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * SearchBar for filtering/searching lists
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full md:w-64"
      aria-label="Search"
    />
  );
};

export default SearchBar; 