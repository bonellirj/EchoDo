import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import ThemeSelector from '../components/ThemeSelector';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 pt-20">
        <h1 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">
          {t('settings.title')}
        </h1>
        
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {t('settings.language')}
            </h2>
            <LanguageSelector />
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {t('settings.theme')}
            </h2>
            <ThemeSelector />
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {t('settings.about')}
            </h2>
            <div className="text-gray-500 dark:text-gray-400">
              <p>EchoDo - Voice Task Creator</p>
              <p className="text-sm mt-1">{t('settings.version')}: 1.0.0</p>
              <p className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: t('settings.demoSystem') }}></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 