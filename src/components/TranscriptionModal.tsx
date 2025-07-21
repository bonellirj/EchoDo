import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcription: string;
  taskTitle: string;
}

const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  isOpen,
  onClose,
  transcription,
  taskTitle
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('task.transcription.title', 'Original Transcription')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('task.transcription.task', 'Task')}:
            </h4>
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              {taskTitle}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('task.transcription.original', 'Original Voice Input')}:
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                "{transcription}"
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModal; 