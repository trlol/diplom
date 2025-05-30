import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery);
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
        // Добавляем aria-label для доступности
        aria-label="Search input"
      />
      <button 
        type="submit" 
        className="submit-button"
        // Добавляем disabled состояние если query пустой
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;