import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import type { UserPreferences } from '../types';

interface SpeechToTextLLMSelectorProps {
  value: UserPreferences['speechToTextLLM'];
  onChange: (value: UserPreferences['speechToTextLLM']) => void;
}

const SpeechToTextLLMSelector: React.FC<SpeechToTextLLMSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleLLMChange = (llm: string) => {
    onChange(llm as UserPreferences['speechToTextLLM']);
  };

  const LLM_OPTIONS = [
    { value: 'openai', label: 'OpenAI' },
  ] as const;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('settings.speechToTextLLM')}
      </label>
      <Select.Root value={value} onValueChange={handleLLMChange}>
        <Select.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm leading-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50 w-full">
          <Select.Value />
          <Select.Icon className="text-gray-500 dark:text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <Select.Viewport className="p-1">
              {LLM_OPTIONS.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-8 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default SpeechToTextLLMSelector; 