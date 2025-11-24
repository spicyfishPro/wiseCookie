import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language;
  const isChinese = currentLanguage === 'zh-CN';

  return (
    <div className="language-selector">
      <button
        onClick={() => i18n.changeLanguage('zh-CN')}
        className={`lang-btn ${isChinese ? 'active' : ''}`}
        title="切换到中文"
      >
        <span>🇨🇳</span>
        <span>{t('common.language.chinese')}</span>
      </button>
      <button
        onClick={() => i18n.changeLanguage('en-US')}
        className={`lang-btn ${!isChinese ? 'active' : ''}`}
        title="Switch to English"
      >
        <span>🇺🇸</span>
        <span>{t('common.language.english')}</span>
      </button>
    </div>
  );
};

export default LanguageSelector;