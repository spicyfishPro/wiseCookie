import React from 'react';

const SearchSection = ({ children, title, style, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--border-light)',
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default SearchSection;
