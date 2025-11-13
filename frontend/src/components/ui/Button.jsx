import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  style,
  ...props
}) => {
  const baseStyle = {
    padding: size === 'sm' ? '8px 16px' : '12px 24px',
    borderRadius: '8px',
    fontSize: size === 'sm' ? '0.875rem' : '0.95rem',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const variantStyle = {
    primary: {
      backgroundColor: disabled ? '#cbd5e1' : '#3b82f6',
      color: 'white',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    },
    secondary: {
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      border: '1px solid #e2e8f0',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
    },
  };

  const hoverStyle = {
    primary: {
      backgroundColor: '#2563eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
      transform: disabled ? 'none' : 'translateY(-1px)',
    },
    secondary: {
      backgroundColor: '#e2e8f0',
    },
    outline: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      const style = hoverStyle[variant];
      e.currentTarget.style.backgroundColor = style.backgroundColor;
      if (style.color) e.currentTarget.style.color = style.color;
      if (style.border) e.currentTarget.style.border = style.border;
      if (style.boxShadow) e.currentTarget.style.boxShadow = style.boxShadow;
      if (style.transform) e.currentTarget.style.transform = style.transform;
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      const style = variantStyle[variant];
      e.currentTarget.style.backgroundColor = style.backgroundColor;
      e.currentTarget.style.color = style.color;
      e.currentTarget.style.border = style.border;
      e.currentTarget.style.boxShadow = style.boxShadow;
      e.currentTarget.style.transform = 'none';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...baseStyle,
        ...variantStyle[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
