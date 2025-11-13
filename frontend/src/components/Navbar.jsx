import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span style={{ fontSize: '1.8rem' }}>🍪</span>
        WiseCookie
      </Link>
      <ul className="navbar-nav">
        <li>
          <Link
            to="/predict"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            模型预测
          </Link>
        </li>
        <li>
          <Link
            to="/table"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            交互表格
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;