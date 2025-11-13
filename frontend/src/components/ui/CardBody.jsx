import React from 'react';

const CardBody = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        padding: '24px',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardBody;
