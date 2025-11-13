import React from 'react';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder = '请选择...',
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
      <select
        value={value}
        onChange={onChange}
        name={name}
        style={{
          width: '100%',
          padding: '12px 16px',
          boxSizing: 'border-box',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          fontSize: '0.95rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
