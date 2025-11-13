import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">欢迎来到 WiseCookie</h1>
        <p className="page-subtitle">
          基于机器学习的智能饼干质量预测与分析平台
        </p>
        <div className="page-icon">🍪</div>
      </div>

      {/* Features Section */}
      <div className="section-title">功能特色</div>
      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        <Link to="/predict" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <span className="feature-card-icon">🎯</span>
            <h3 className="feature-card-title">模型预测</h3>
            <p className="feature-card-description">
              输入面筋含量、蛋白质含量、硬度等关键特征，
              获得基于机器学习模型的饼干综合得分预测。
            </p>
            <span className="feature-card-link">
              开始预测 <span className="feature-card-link-arrow">→</span>
            </span>
          </div>
        </Link>

        <Link to="/table" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <span className="feature-card-icon">📊</span>
            <h3 className="feature-card-title">交互表格</h3>
            <p className="feature-card-description">
              浏览和分析现有的饼干数据集，支持按类型筛选、
              相似度搜索和多种排序方式。
            </p>
            <span className="feature-card-link">
              查看数据 <span className="feature-card-link-arrow">→</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Info Section */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          borderLeft: '4px solid var(--primary-color)',
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          💡 关于预测模型
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '12px',
          }}
        >
          我们的预测模型基于集成学习方法，融合了多种机器学习算法，
          能够根据饼干的物理化学特征准确预测其综合质量得分。
        </p>
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
          }}
        >
          该平台旨在帮助食品研发人员快速评估配方可行性，
          优化生产工艺，提高产品开发效率。
        </p>
      </div>
    </div>
  );
}

export default HomePage;