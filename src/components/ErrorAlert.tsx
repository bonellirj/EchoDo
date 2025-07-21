import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { XIcon, SadFaceIcon } from './Icons';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  const { t } = useTranslation();
  if (!error) return null;

  // Extract server error message if it's a debug message
  const isDebugMessage = error.startsWith('DEBUG: ');
  const serverError = isDebugMessage ? error.replace('DEBUG: ', '') : error;
  
  // Try to parse JSON error message from server
  let displayError = serverError;
  try {
    if (serverError.includes('message: ')) {
      const messageMatch = serverError.match(/message: (.+)$/);
      if (messageMatch) {
        const messageContent = messageMatch[1];
        // Try to parse as JSON
        const parsedMessage = JSON.parse(messageContent);
        
        // Check if there's a details field that contains another JSON string
        if (parsedMessage.details) {
          try {
            const detailsParsed = JSON.parse(parsedMessage.details);
            if (detailsParsed.message) {
              displayError = detailsParsed.message;
            } else if (detailsParsed.error_code) {
              displayError = detailsParsed.error_code;
            }
          } catch (detailsError) {
            // If details parsing fails, use the details as is
            displayError = parsedMessage.details;
          }
        } else if (parsedMessage.error) {
          displayError = parsedMessage.error;
        } else if (parsedMessage.message) {
          displayError = parsedMessage.message;
        }
      }
    }
  } catch (e) {
    // If parsing fails, use the original error
    displayError = serverError;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <SadFaceIcon className="w-6 h-6 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {t('voice.taskCreationError')}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {displayError}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorAlert; 