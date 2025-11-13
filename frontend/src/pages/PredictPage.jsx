import React from 'react';
import PredictionForm from '../components/PredictionForm'; // 导入我们之前创建的组件

function PredictPage() {
  return (
    <div>
      <h1>利用籽粒性状预测饼干综合得分</h1>
      <p>
        请在下方输入籽粒蛋白质含量、籽粒硬度和籽粒面筋蛋白含量的数值。
      </p>
      <hr style={{ margin: '20px 0' }} />
      <PredictionForm />
    </div>
  );
}

export default PredictPage;