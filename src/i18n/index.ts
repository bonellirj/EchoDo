import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import en from './locales/en.json';
import pt from './locales/pt.json';
import ptBR from './locales/pt-BR.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  'pt-BR': { translation: ptBR },
  es: { translation: es },
  fr: { translation: fr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable Suspense for better error handling
    },
  });

export default i18n; 