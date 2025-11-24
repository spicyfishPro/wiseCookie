import React from 'react';
import { useTranslation } from 'react-i18next';
import PredictionForm from '../components/PredictionForm';

function PredictPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('predict.title')}</h1>
        <p className="page-subtitle">
          {t('predict.subtitle')}
        </p>
      </div>
      <PredictionForm />
    </div>
  );
}

export default PredictPage;