import React from 'react';

interface VoiceButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

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
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        fixed bottom-20 right-4 w-16 h-16 rounded-full shadow-lg
        flex items-center justify-center transition-all duration-300
        ${isRecording
          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
          : 'bg-blue-600 hover:bg-blue-700'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer transform hover:scale-105'
        }
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {isRecording ? (
          // Stop icon (square)
          <div className="w-4 h-4 bg-white rounded-sm" />
        ) : (
          // Microphone icon (circle with dot)
          <div className="relative">
            <div className="w-4 h-4 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
          </div>
        )}
      </div>
    </button>
  );
};

export default VoiceButton; 