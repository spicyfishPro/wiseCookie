import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 后端API的地址，当更换部署环境时，修改IP和端口
const API_URL = 'http://202.112.170.143:23300';

function PredictionForm() {
  const [formData, setFormData] = useState({});
  const [expectedFeatures, setExpectedFeatures] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. 组件加载时，从后端获取期望的特征列表
  useEffect(() => {
    axios.get(`${API_URL}/api/v1/features`)
      .then(response => {
        const features = response.data.expected_features;
        setExpectedFeatures(features);
        // 初始化 formData
        const initialForm = features.reduce((acc, feature) => {
          acc[feature] = ''; // 默认为空字符串
          return acc;
        }, {});
        setFormData(initialForm);
      })
      .catch(err => {
        setError('无法从后端加载特征列表。');
        console.error(err);
      });
  }, []);

  // 2. 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 允许空字符串（用于表单验证），否则转为数字
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  // 3. 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    // 检查是否有空字段
    if (Object.values(formData).some(v => v === '')) {
      setError('所有字段均为必填项。');
      setIsLoading(false);
      return;
    }

    // ✅ 关键修复：将 formData 包装到 { features: ... } 中
    const payload = { features: formData };

    axios.post(`${API_URL}/api/v1/predict`, payload)
      .then(response => {
        setPrediction(response.data.prediction);
      })
      .catch(err => {
        const errorMsg = err.response?.data?.detail || '预测失败，请检查输入。';
        setError(errorMsg);
        console.error('预测请求失败:', err.response || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (expectedFeatures.length === 0 && !error) {
    return <div>正在加载模型配置...</div>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>模型预测</h2>
      <p>请输入以下特征值以进行预测：</p>
      
      <form onSubmit={handleSubmit}>
        {expectedFeatures.map(feature => (
          <div key={feature} style={{ marginBottom: '10px' }}>
            <label>
              {feature}:
              <input
                type="number"
                name={feature}
                value={formData[feature]}
                onChange={handleChange}
                step="any"
                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>
          {isLoading ? '正在预测...' : '预测'}
        </button>
      </form>

      {/* 4. 显示结果 */}
      {prediction !== null && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#e0f7fa' }}>
          <h3>预测结果: {prediction.toFixed(6)}</h3>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'red' }}>
          <strong>错误:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;