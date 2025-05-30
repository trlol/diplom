import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo">Music</Link>
        <SearchForm onSearch={onSearch} />
      </div>
    </header>
  );
};

export default Header;