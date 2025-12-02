import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">{t('home.title')}</h1>
        <p className="page-subtitle">
          {t('home.subtitle')}
        </p>
        <div className="page-icon">🍪</div>
      </div>

      {/* Features Section */}
      <div className="section-title">{t('home.features.title')}</div>
      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        <Link to="/predict" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <span className="feature-card-icon">🎯</span>
            <h3 className="feature-card-title">{t('home.features.predict.title')}</h3>
            <p className="feature-card-description">
              {t('home.features.predict.description')}
            </p>
            <span className="feature-card-link">
              {t('home.features.predict.link')} <span className="feature-card-link-arrow">→</span>
            </span>
          </div>
        </Link>

        <Link to="/table" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <span className="feature-card-icon">📊</span>
            <h3 className="feature-card-title">{t('home.features.table.title')}</h3>
            <p className="feature-card-description">
              {t('home.features.table.description')}
            </p>
            <span className="feature-card-link">
              {t('home.features.table.link')} <span className="feature-card-link-arrow">→</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Info Section */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          borderLeft: '4px solid var(--primary-color)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          💡 {t('home.about.title')}
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '12px',
          }}
        >
          {t('home.about.description1')}
        </p>
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
          }}
        >
          {t('home.about.description2')}
        </p>
      </div>
    </div>
  );
}

export default HomePage;