import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  style,
  ...props
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label
          style={{
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '6px',
            display: 'block',
            fontSize: '0.9rem',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          boxSizing: 'border-box',
          border: error ? '1px solid #ef4444' : '1px solid var(--border-color)',
          borderRadius: '8px',
          fontSize: '0.95rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#3b82f6';
          e.target.style.boxShadow = error
            ? '0 0 0 3px rgba(239, 68, 68, 0.08)'
            : '0 0 0 3px rgba(59, 130, 246, 0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            color: '#ef4444',
            fontSize: '0.875rem',
            marginTop: '4px',
            display: 'block',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
