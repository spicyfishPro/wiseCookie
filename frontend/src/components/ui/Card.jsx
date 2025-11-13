import React from 'react';

const Card = ({ children, style, className = '', ...props }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--border-light)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
