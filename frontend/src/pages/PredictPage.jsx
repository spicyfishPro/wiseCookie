import React from 'react';
import PredictionForm from '../components/PredictionForm';
import './PredictPage.css';

function PredictPage() {
  return (
    <div className="predict-page">
      <div className="predict-header">
        <h1>🤖 智能预测系统</h1>
        <p>输入饼干特性参数，获取精准预测结果</p>
      </div>
      <PredictionForm />
    </div>
  );
}

export default PredictPage;