import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import pt from './pt.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.startsWith('pt') ? 'pt' : 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  interpolation: { escapeValue: false },
});

export default i18n;