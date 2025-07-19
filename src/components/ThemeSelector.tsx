import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { UserPreferences } from '../types';

const ThemeSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme, changeTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    changeTheme(theme as UserPreferences['theme']);
  };

  const getCurrentThemeLabel = () => {
    return t(`settings.themes.${currentTheme}`);
  };

  const THEME_OPTIONS = [
    { value: 'light', label: t('settings.themes.light'), icon: Sun },
    { value: 'dark', label: t('settings.themes.dark'), icon: Moon },
  ] as const;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('settings.theme')}
      </label>
      <Select.Root value={currentTheme} onValueChange={handleThemeChange}>
        <Select.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm leading-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50 w-full">
          <div className="flex items-center">
            {(() => {
              const currentOption = THEME_OPTIONS.find(opt => opt.value === currentTheme);
              const IconComponent = currentOption?.icon || Sun;
              return <IconComponent className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />;
            })()}
            <Select.Value placeholder={getCurrentThemeLabel()} />
          </div>
          <Select.Icon className="text-gray-500 dark:text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>
        
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <Select.Viewport className="p-1">
              {THEME_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex items-center px-8 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none"
                  >
                    <div className="flex items-center flex-1">
                      <IconComponent className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </div>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default ThemeSelector; 