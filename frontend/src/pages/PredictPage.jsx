import React from 'react';
import PredictionForm from '../components/PredictionForm';

function PredictPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">利用籽粒性状预测饼干综合得分</h1>
        <p className="page-subtitle">
          请在下方输入籽粒蛋白质含量、籽粒硬度和籽粒面筋蛋白含量的数值
        </p>
      </div>
      <PredictionForm />
    </div>
  );
}

export default PredictPage;