import React, { useState } from 'react';
import VoiceButton from '../components/VoiceButton';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

const HomePage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Buy groceries',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Call mom',
      dueDate: new Date(),
      completed: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ]);

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('Starting voice recording...');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('Stopping voice recording...');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Tasks
        </h1>
        
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tasks yet</p>
            <p className="text-sm mt-2">Tap the microphone button to create your first task</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Pending Tasks</h2>
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
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Completed Tasks</h2>
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