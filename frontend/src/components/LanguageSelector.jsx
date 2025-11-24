import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language;
  const isChinese = currentLanguage === 'zh-CN';

  const toggleLanguage = () => {
    const newLanguage = isChinese ? 'en-US' : 'zh-CN';
    i18n.changeLanguage(newLanguage);
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  const activeStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)'
  };

  return (
    <div className="language-selector"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '22px',
        padding: '4px'
      }}
    >
      <button
        onClick={() => i18n.changeLanguage('zh-CN')}
        style={{
          ...buttonStyle,
          ...(isChinese ? activeStyle : {})
        }}
        title="切换到中文"
      >
        🇨🇳 {t('common.language.chinese')}
      </button>
      <button
        onClick={() => i18n.changeLanguage('en-US')}
        style={{
          ...buttonStyle,
          ...(!isChinese ? activeStyle : {})
        }}
        title="Switch to English"
      >
        🇺🇸 {t('common.language.english')}
      </button>
    </div>
  );
};

export default LanguageSelector;