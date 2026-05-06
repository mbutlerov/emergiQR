import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from '../public/locales/es/translation.json';
import en from '../public/locales/en/translation.json';
import pt from '../public/locales/pt/translation.json';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'es',
      supportedLngs: ['es', 'en', 'pt'],
      resources: {
        es: { translation: es },
        en: { translation: en },
        pt: { translation: pt },
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
