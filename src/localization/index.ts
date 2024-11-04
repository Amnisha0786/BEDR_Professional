import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

import en from './en.json';
import fr from './fr.json';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false
  }
});

export default i18next;
