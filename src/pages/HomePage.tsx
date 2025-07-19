import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceButton from '../components/VoiceButton';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const { tasks, toggleTaskCompletion, deleteTask, isLoading, error } = useTasks();

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('Starting voice recording...');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('Stopping voice recording...');
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskCompletion(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 pt-20">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{t('common.error')}: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 pt-20">
        <h1 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">
          {t('tasks.title')}
        </h1>
        
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>{t('tasks.noTasks')}</p>
            <p className="text-sm mt-2">{t('tasks.addFirstTask')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('tasks.pending')}</h2>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('tasks.completed')}</h2>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <VoiceButton
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        isRecording={isRecording}
      />
    </div>
  );
};

export default HomePage; 