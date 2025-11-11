import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎来到机器学习预测平台</h1>
      <p>本项目包含两个主要功能：</p>
      <ul>
        <li>
          <strong><Link to="/predict">模型预测</Link></strong>:
          一个基于您在 `model.py` 中训练的模型的交互式预测界面。
        </li>
        <li>
          <strong><Link to="/table">交互表格</Link></strong>:
          一个纯前端的CSV数据查看器，支持按列搜索和过滤。
        </li>
      </ul>
      <p>请使用顶部的导航栏开始探索。</p>
    </div>
  );
}

export default HomePage;