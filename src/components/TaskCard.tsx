import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../types';
import { formatDate, formatDateTime, isToday, isTomorrow } from '../lib/utils';
import TranscriptionModal from './TranscriptionModal';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getDateDisplay = () => {
    if (!task.dueDate) return null;
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    if (isToday(task.dueDate)) {
      return `${t('calendar.today')} ${formatTime(task.dueDate)}`;
    }
    if (isTomorrow(task.dueDate)) {
      return `${t('calendar.tomorrow')} ${formatTime(task.dueDate)}`;
    }
    return formatDateTime(task.dueDate);
  };

  return (
    <div className={`card dark:bg-gray-800 dark:border-gray-700 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </h3>
            {task.dueDate && (
              <p className={`text-sm ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                Due: {getDateDisplay()}
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Created: {formatDate(task.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {task.transcription && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
              aria-label="View transcription"
              title={t('task.transcription.view', 'View original transcription')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {task.transcription && (
        <TranscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transcription={task.transcription}
          taskTitle={task.title}
        />
      )}
    </div>
  );
};

export default TaskCard; 