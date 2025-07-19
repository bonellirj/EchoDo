import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, StopIcon } from './Icons';

interface VoiceButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

// Componente para as ondas sonoras
const SoundWaves: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut"
          }}
          className="absolute w-16 h-16 rounded-full border border-red-300"
        />
      ))}
    </div>
  );
};

const VoiceButton: React.FC<VoiceButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  disabled = false,
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2
      }}
      whileHover={{ 
        scale: disabled ? 1 : 1.1,
        rotate: disabled ? 0 : [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        x: disabled ? 0 : [0, -3, 3, -3, 0],
        transition: { duration: 0.2 }
      }}
      className={`
        fixed bottom-20 right-4 w-16 h-16 rounded-full shadow-lg
        flex items-center justify-center transition-colors duration-300
        ${isRecording
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-600 hover:bg-blue-700'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
        }
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
    >
      {/* Glow effect when recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full bg-red-400 blur-md"
          />
        )}
      </AnimatePresence>

      {/* Sound waves when recording */}
      <AnimatePresence>
        {isRecording && <SoundWaves />}
      </AnimatePresence>

      {/* Animated background ring when recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 rounded-full border-2 border-red-400"
          />
        )}
      </AnimatePresence>

      {/* Pulsing effect when recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.3, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-red-400"
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="w-8 h-8 flex items-center justify-center relative z-10"
        animate={isRecording ? {
          scale: [1, 1.1, 1],
          transition: { duration: 0.6, repeat: Infinity }
        } : {}}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="stop"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StopIcon className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating particles when recording */}
      <AnimatePresence>
        {isRecording && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: Math.cos(i * 120 * Math.PI / 180) * 30,
                  y: Math.sin(i * 120 * Math.PI / 180) * 30
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-red-300 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default VoiceButton; 