import React from 'react';

const PredictionResult = ({ prediction, loading, empty }) => {
  if (loading) {
    return (
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '32px 24px',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '16px',
          }}
        ></div>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>正在计算预测结果...</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div
        style={{
          padding: '48px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '2px dashed var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-light)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '1rem' }}>预测结果将显示在此处</p>
      </div>
    );
  }

  if (prediction !== null) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '12px',
          padding: '32px 24px',
          border: '1px solid var(--primary-light)',
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            margin: '0 0 12px 0',
            fontWeight: 500,
          }}
        >
          预测的饼干综合得分
        </h3>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: 'var(--primary-color)',
            lineHeight: 1,
            margin: '16px 0',
          }}
        >
          {prediction.toFixed(2)}
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          基于您输入的特征值
        </p>
      </div>
    );
  }

  return null;
};

export default PredictionResult;
