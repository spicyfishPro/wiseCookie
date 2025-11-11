import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍪</span>
          <span className="brand-text">wiseCookie</span>
        </Link>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`line ${isOpen ? 'open' : ''}`}></span>
          <span className={`line ${isOpen ? 'open' : ''}`}></span>
          <span className={`line ${isOpen ? 'open' : ''}`}></span>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="link-icon">🏠</span>
            首页
          </Link>
          <Link
            to="/predict"
            className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="link-icon">🤖</span>
            模型预测
          </Link>
          <Link
            to="/table"
            className={`nav-link ${isActive('/table') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="link-icon">📊</span>
            数据分析
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
