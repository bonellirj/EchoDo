import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MicrophoneIcon, StopIcon } from './Icons';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import ErrorAlert from './ErrorAlert';
import RecordingProgress from './RecordingProgress';
import LoadingSpinner from './LoadingSpinner';
import type { Task } from '../types';

interface VoiceButtonProps {
  disabled?: boolean;
  onTaskCreated?: (task: Task) => void;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  disabled = false,
  onTaskCreated,
}) => {
  const { t } = useTranslation();
  const {
    isRecording,
    recordingTime,
    maxRecordingTime,
    isProcessing,
    error,
    startRecording,
    stopRecordingManually,
    reset,
  } = useVoiceRecording({ onTaskCreated });

  const handleClick = async () => {
    if (isRecording) {
      await stopRecordingManually();
    } else {
      await startRecording();
    }
  };

  const handleErrorClose = () => {
    reset();
  };

  return (
    <>
      {/* Error Alert */}
      <ErrorAlert error={error} onClose={handleErrorClose} />
      
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <div className="bg-white rounded-lg p-8 shadow-xl relative max-w-sm w-full mx-4">
              <LoadingSpinner 
                size={60}
                color="#3B82F6"
                text={t('voice.processing')}
                className="mb-4"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t('voice.processingTitle')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('voice.processingDescription')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Progress Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <div className="bg-white rounded-lg p-6 shadow-xl relative">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t('voice.recording')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('voice.speakNow')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {t('voice.clickToStop')}
                </p>
              </div>
              <RecordingProgress 
                currentTime={recordingTime} 
                maxTime={maxRecordingTime}
                size={120}
              />
              
              {/* Stop Button inside overlay */}
              <div className="flex justify-center mt-6">
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors duration-200"
                  aria-label={t('voice.stopRecordingButton')}
                >
                  <StopIcon className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Voice Button - Only show when not recording */}
      <AnimatePresence>
        {!isRecording && (
          <motion.button
            onClick={handleClick}
            disabled={disabled || isProcessing}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
            whileHover={{ 
              scale: (disabled || isProcessing) ? 1 : 1.1,
              rotate: (disabled || isProcessing) ? 0 : [0, -5, 5, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ 
              scale: (disabled || isProcessing) ? 1 : 0.95,
              x: (disabled || isProcessing) ? 0 : [0, -3, 3, -3, 0],
              transition: { duration: 0.2 }
            }}
            className={`
              fixed bottom-20 right-4 w-16 h-16 rounded-full shadow-lg
              flex items-center justify-center transition-colors duration-300
              ${isProcessing
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-600 hover:bg-blue-700'
              }
              ${(disabled || isProcessing)
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
            `}
            aria-label={isProcessing ? t('voice.processingButton') : t('voice.startRecordingButton')}
          >
            <MicrophoneIcon className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceButton; 