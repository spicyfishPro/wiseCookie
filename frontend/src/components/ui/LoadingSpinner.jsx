import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'md', text, style }) => {
  const { t } = useTranslation();
  const displayText = text || t('common.loading');
  const sizeStyle = {
    sm: { width: '24px', height: '24px', borderWidth: '2px' },
    md: { width: '40px', height: '40px', borderWidth: '3px' },
    lg: { width: '56px', height: '56px', borderWidth: '4px' },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        ...style,
      }}
    >
      <div
        style={{
          width: sizeStyle[size].width,
          height: sizeStyle[size].height,
          border: `${sizeStyle[size].borderWidth} solid var(--border-color)`,
          borderTopColor: 'var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      ></div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{displayText}</span>
    </div>
  );
};

export default LoadingSpinner;
