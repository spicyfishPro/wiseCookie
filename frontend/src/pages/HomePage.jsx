import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎来到 WiseCookie 饼干综合得分预测平台</h1>
      <p>本网站包含两个主要功能：</p>
      <ul>
        <li>
          <strong><Link to="/predict">模型预测</Link></strong>:
          利用籽粒性状预测饼干综合得分。
        </li>
        <li>
          <strong><Link to="/table">交互表格</Link></strong>:
          
        </li>
      </ul>
      <p>请使用顶部的导航栏开始探索。</p>
    </div>
  );
}

export default HomePage;