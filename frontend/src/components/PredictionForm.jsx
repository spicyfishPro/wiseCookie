import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import PredictionResult from './ui/PredictionResult';

// 后端API的地址
const API_URL = 'http://202.112.170.143:23300';

function PredictionForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [expectedFeatures, setExpectedFeatures] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🟢 动态获取特征标签
  const getFeatureLabel = (feature) => {
    // 先尝试从国际化资源中获取
    const i18nKey = `predict.features.${feature}`;
    if (t(i18nKey, { defaultValue: '' }) !== '') {
      return t(i18nKey);
    }

    // 如果没有国际化翻译，则使用默认的英文到中文映射
    const FEATURE_LABELS = {
      "Gluten_content": t('predict.features.glutenContent', { defaultValue: "面筋含量(%)" }),
      "Protein_content": t('predict.features.proteinContent', { defaultValue: "蛋白质含量(%)" }),
      "Hardness": t('predict.features.hardness', { defaultValue: "硬度" }),
    };

    return FEATURE_LABELS[feature] || feature;
  };

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
        setError(t('predict.form.error'));
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
      setError(t('predict.form.required'));
      setIsLoading(false);
      return;
    }

    const payload = { features: formData };

    axios.post(`${API_URL}/api/v1/predict`, payload)
      .then(response => {
        setPrediction(response.data.prediction);
      })
      .catch(err => {
        const errorMsg = err.response?.data?.detail || t('predict.form.predictionFailed');
        setError(errorMsg);
        console.error('预测请求失败:', err.response || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (expectedFeatures.length === 0 && !error) {
    return <div>{t('predict.form.loading')}</div>;
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
                  label={getFeatureLabel(feature)}
                  type="number"
                  name={feature}
                  value={formData[feature]}
                  onChange={handleChange}
                  placeholder={t('predict.form.placeholder', { feature: getFeatureLabel(feature) })}
                />
              ))}
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                style={{ width: '100%' }}
              >
                {isLoading ? t('predict.form.submitting') : t('predict.form.submit')}
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
          <strong>{t('predict.form.errorTitle')}</strong> {error}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;