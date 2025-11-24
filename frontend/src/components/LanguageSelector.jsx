import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language;
  // 确保 fallback 到 zh-CN，防止初始状态为空导致滑块位置错误
  const activeLang = currentLanguage === 'en-US' ? 'en-US' : 'zh-CN';
  const isChinese = activeLang === 'zh-CN';

  return (
    <div className="language-selector" data-active={activeLang}>
      {/* 滑动背景块 */}
      <div className="lang-slider" />

      {/* 按钮选项 */}
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