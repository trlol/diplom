import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for artists, tracks..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default SearchForm;