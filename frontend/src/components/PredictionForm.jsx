import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PredictionForm.css';

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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>正在加载模型配置...</p>
      </div>
    );
  }

  return (
    <div className="prediction-form-container">
      {error && !expectedFeatures.length ? (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <div>
            <strong>加载失败</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="form-header">
            <h2>模型预测</h2>
            <p>请输入饼干特性参数，系统将进行精准预测</p>
          </div>

          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-grid">
              {expectedFeatures.map((feature, index) => (
                <div key={feature} className="form-group">
                  <label htmlFor={feature} className="form-label">
                    <span className="feature-number">{index + 1}</span>
                    <span className="feature-name">{feature}</span>
                  </label>
                  <input
                    id={feature}
                    type="number"
                    name={feature}
                    value={formData[feature]}
                    onChange={handleChange}
                    step="any"
                    placeholder="输入数值"
                    className="form-input"
                  />
                  <span className="input-indicator"></span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  正在预测...
                </>
              ) : (
                <>
                  🚀 开始预测
                </>
              )}
            </button>
          </form>

          {/* 预测结果 */}
          {prediction !== null && (
            <div className="result-card success">
              <div className="result-icon">✨</div>
              <div className="result-content">
                <h3>预测结果</h3>
                <div className="result-value">{prediction.toFixed(6)}</div>
                <p className="result-description">预测成功！</p>
              </div>
            </div>
          )}

          {/* 错误消息 */}
          {error && (
            <div className="result-card error">
              <div className="result-icon">❌</div>
              <div className="result-content">
                <h3>预测失败</h3>
                <p className="error-message">{error}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PredictionForm;