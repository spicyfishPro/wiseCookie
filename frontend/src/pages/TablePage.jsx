import React from 'react';
import { useTranslation } from 'react-i18next';
import InteractiveTable from '../components/InteractiveTable';

function TablePage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('table.title')}</h1>
        <p className="page-subtitle">
          {t('table.subtitle')}
        </p>
      </div>
      <InteractiveTable />
    </div>
  );
}

export default TablePage;