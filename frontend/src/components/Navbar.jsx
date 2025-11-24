import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🍪</span>
          <span className="navbar-title">{t('navbar.brand')}</span>
        </Link>
        <div className="navbar-nav">
          <NavLink
            to="/predict"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            {t('navbar.predict')}
          </NavLink>
          <NavLink
            to="/table"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            {t('navbar.table')}
          </NavLink>
        </div>
      </div>
      <div className="navbar-right">
        <LanguageSelector />
      </div>
    </nav>
  );
}

export default Navbar;