import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">🍪 智能饼干预测平台</h1>
        <p className="hero-subtitle">基于机器学习的饼干特性预测与分析系统</p>
      </div>

      <div className="features-container">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h2>模型预测</h2>
          <p>基于深度学习模型的交互式预测界面。输入饼干特性参数，即时获得精准预测结果。</p>
          <Link to="/predict" className="feature-button">开始预测 →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h2>数据分析</h2>
          <p>强大的数据可视化工具。支持相似度搜索、类型筛选和多维度数据分析。</p>
          <Link to="/table" className="feature-button">浏览数据 →</Link>
        </div>
      </div>

      <div className="info-section">
        <h3>功能介绍</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-number">1</span>
            <h4>智能特征工程</h4>
            <p>自动提取和优化饼干样本特征，确保模型输入数据质量最优</p>
          </div>
          <div className="info-item">
            <span className="info-number">2</span>
            <h4>实时预测</h4>
            <p>支持单个样本实时预测，毫秒级响应速度，高精度预测结果</p>
          </div>
          <div className="info-item">
            <span className="info-number">3</span>
            <h4>相似度搜索</h4>
            <p>基于多维欧氏距离算法，快速找到最相似的饼干样本进行对标</p>
          </div>
          <div className="info-item">
            <span className="info-number">4</span>
            <h4>数据可视化</h4>
            <p>交互式表格展示，支持排序、过滤和自定义搜索，数据一目了然</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>准备好开始了吗？</h3>
        <p>选择一项功能，体验强大的数据分析和预测能力</p>
        <div className="cta-buttons">
          <Link to="/predict" className="cta-button primary">进入预测系统</Link>
          <Link to="/table" className="cta-button secondary">查看数据库</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;