import React from 'react';

const CardHeader = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-light)',
        padding: '16px 24px',
        borderRadius: '12px 12px 0 0',
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontSize: '1.05rem',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardHeader;
