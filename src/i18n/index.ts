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

// Get saved language from localStorage or use browser language as fallback
const getInitialLanguage = (): string => {
  try {
    const savedPreferences = localStorage.getItem('echodo_preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      if (preferences.language && resources[preferences.language as keyof typeof resources]) {
        return preferences.language;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved language preference:', error);
  }
  
  // Fallback to browser language or English
  const browserLang = navigator.language.split('-')[0];
  return resources[browserLang as keyof typeof resources] ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable Suspense for better error handling
    },
  });

export default i18n; 