import React from 'react';
import { motion } from 'framer-motion';

interface RecordingProgressProps {
  currentTime: number;
  maxTime: number;
  size?: number;
  strokeWidth?: number;
}

const RecordingProgress: React.FC<RecordingProgressProps> = ({
  currentTime,
  maxTime,
  size = 120,
  strokeWidth = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(currentTime / maxTime, 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  const remainingTime = maxTime - currentTime;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(239, 68, 68, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            key={remainingTime}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold text-red-500"
          >
            {remainingTime}
          </motion.div>
          <div className="text-xs text-gray-500">seconds</div>
        </div>
      </div>
    </div>
  );
};

export default RecordingProgress; 