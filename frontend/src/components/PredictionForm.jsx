import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 后端API的地址
const API_URL = 'http://202.112.170.143:23300';

// 🟢 1. 在这里定义英文到中文的映射关系
// 请根据你后端实际返回的变量名（Console.log可以看到）进行修改
const FEATURE_LABELS = {
  "Gluten_content": " 面筋含量(%)",
  "Protein_content": "蛋白质含量(%)",
  "Hardness": "硬度",
  // ... 在这里添加更多映射，格式为 "英文变量": "中文名称"
};

function PredictionForm() {
  const [formData, setFormData] = useState({});
  const [expectedFeatures, setExpectedFeatures] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/v1/features`)
      .then(response => {
        const features = response.data.expected_features;
        setExpectedFeatures(features);
        
        // 💡 调试技巧：在控制台打印后端返回了哪些英文变量，方便你填写 FEATURE_LABELS
        console.log("后端需要的特征变量:", features);

        const initialForm = features.reduce((acc, feature) => {
          acc[feature] = ''; 
          return acc;
        }, {});
        setFormData(initialForm);
      })
      .catch(err => {
        setError('无法从后端加载特征列表。');
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    if (Object.values(formData).some(v => v === '')) {
      setError('所有字段均为必填项。');
      setIsLoading(false);
      return;
    }

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
      <h2 style={{ textAlign: 'center' }}>饼干质量预测系统</h2>
      
      <form onSubmit={handleSubmit}>
        {expectedFeatures.map(feature => (
          <div key={feature} style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              {/* 🟢 2. 尝试获取中文名称，如果映射表中没有，则回退显示英文 */}
              {FEATURE_LABELS[feature] || feature}:
            </label>
            <input
              type="number"
              name={feature}
              value={formData[feature]}
              onChange={handleChange}
              step="any"
              placeholder={`请输入 ${FEATURE_LABELS[feature] || feature}`}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isLoading ? '#ccc' : '#1976d2', 
            color: '#fff', 
            border: 'none', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {isLoading ? '正在计算...' : '开始预测'}
        </button>
      </form>

      {prediction !== null && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa', borderRadius: '4px' }}>
          <h3 style={{ margin: 0 }}>预测的饼干综合得分: <span style={{ color: '#00796b' }}>{prediction.toFixed(2)}</span></h3>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'd32f2f', borderRadius: '4px' }}>
          <strong>错误:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;