import React from 'react';
import { Link } from 'react-router-dom'; // 使用 Link 来实现客户端路由，避免页面刷新

function Navbar() {
  // 内联样式
  const navStyle = {
    backgroundColor: '#2c3e50', // 深蓝灰色
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500'
  };

  const titleStyle = {
    ...linkStyle,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginRight: 'auto' // 将标题推到最左边
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={titleStyle}>WiseCookie 饼干综合得分预测</Link>
      <Link to="/predict" style={linkStyle}>模型预测</Link>
      <Link to="/table" style={linkStyle}>交互表格</Link>
    </nav>
  );
}

export default Navbar;