import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span style={{ fontSize: '1.8rem' }}>🍪</span>
        {t('navbar.brand')}
      </Link>
      <div className="navbar-center">
        <ul className="navbar-nav">
          <li>
            <Link
              to="/predict"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              {t('navbar.predict')}
            </Link>
          </li>
          <li>
            <Link
              to="/table"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              {t('navbar.table')}
            </Link>
          </li>
        </ul>
      </div>
      <LanguageSelector />
    </nav>
  );
}

export default Navbar;