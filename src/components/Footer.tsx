import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer" className="footer-link">
            Powered by Last.fm
          </a>
          <span className="footer-text">Music makes the world go round</span>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Music App - All rights reserved. Сто процентов)))
        </div>
      </div>
    </footer>
  );
};

export default Footer;