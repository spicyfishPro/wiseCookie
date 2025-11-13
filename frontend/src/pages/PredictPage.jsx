import React from 'react';
import PredictionForm from '../components/PredictionForm'; // 导入我们之前创建的组件

function PredictPage() {
  return (
    <div>
      <h1>机器学习模型预测</h1>
      <p>
        请在下方输入饼干模型的输入变量。
      </p>
      <hr style={{ margin: '20px 0' }} />
      <PredictionForm />
    </div>
  );
}

export default PredictPage;