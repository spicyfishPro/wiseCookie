import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言资源
import zhCN from '../locales/zh-CN.json';
import enUS from '../locales/en-US.json';

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
};

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 绑定 react-i18next
  .init({
    resources,
    fallbackLng: 'en-US', // 默认语言
    debug: false, // 开发环境可以设置为 true 来调试

    interpolation: {
      escapeValue: false // React 已经默认转义
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // 缓存用户语言偏好
    }
  });

export default i18n;