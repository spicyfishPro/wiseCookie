import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import PredictionResult from './ui/PredictionResult';

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
    <div className="container">
      <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        {/* 左侧：输入表单 */}
        <div style={{ flex: '0 0 50%' }}>
          <Card>
            <form onSubmit={handleSubmit}>
              {expectedFeatures.map(feature => (
                <Input
                  key={feature}
                  label={FEATURE_LABELS[feature] || feature}
                  type="number"
                  name={feature}
                  value={formData[feature]}
                  onChange={handleChange}
                  placeholder={`请输入 ${FEATURE_LABELS[feature] || feature}`}
                />
              ))}
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                style={{ width: '100%' }}
              >
                {isLoading ? '正在计算...' : '开始预测'}
              </Button>
            </form>
          </Card>
        </div>

        {/* 右侧：预测结果 */}
        <div style={{ flex: '0 0 50%' }}>
          <PredictionResult
            prediction={prediction}
            loading={isLoading}
            empty={!prediction && !isLoading}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
            border: '1px solid #fecaca',
          }}
        >
          <strong>错误:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;