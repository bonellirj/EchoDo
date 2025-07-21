import React, { useState, useMemo } from 'react';
import TaskCard from '../components/TaskCard';
import VoiceButton from '../components/VoiceButton';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import type { Task } from '../types';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

interface DayTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const DayTasksModal: React.FC<DayTasksModalProps> = ({
  isOpen,
  onClose,
  date,
  tasks,
  onToggleComplete,
  onDelete,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const formatDate = (date: Date) => {
    const currentLanguage = i18n.language || 'en';
    return date.toLocaleDateString(currentLanguage, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatDate(date)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>{t('calendar.noTasksForDay')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('calendar.pendingTasks')}</h3>
                  <div className="space-y-3">
                    {pendingTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('calendar.completedTasks')}</h3>
                  <div className="space-y-3">
                    {completedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const { tasks, toggleTaskCompletion, deleteTask, isLoading, error } = useTasks();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.getTime() === today.getTime(),
        tasks: dayTasks,
      });
    }

    return days;
  }, [currentYear, currentMonth, tasks]);

  const monthNames = [
    t('calendar.months.january'), t('calendar.months.february'), t('calendar.months.march'), 
    t('calendar.months.april'), t('calendar.months.may'), t('calendar.months.june'),
    t('calendar.months.july'), t('calendar.months.august'), t('calendar.months.september'), 
    t('calendar.months.october'), t('calendar.months.november'), t('calendar.months.december')
  ];

  const weekDays = [
    t('calendar.weekDays.sun'), t('calendar.weekDays.mon'), t('calendar.weekDays.tue'), 
    t('calendar.weekDays.wed'), t('calendar.weekDays.thu'), t('calendar.weekDays.fri'), 
    t('calendar.weekDays.sat')
  ];

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day.date);
    setIsModalOpen(true);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskCompletion(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };



  const getTasksForSelectedDay = () => {
    if (!selectedDay) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === selectedDay.getDate() &&
        taskDate.getMonth() === selectedDay.getMonth() &&
        taskDate.getFullYear() === selectedDay.getFullYear()
      );
    });
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('calendar.title')}</h1>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 mb-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
            {weekDays.map(day => (
              <div key={day} className="p-1 text-center text-xs font-medium text-gray-600 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const pendingTasks = day.tasks.filter(task => !task.completed);
              const completedTasks = day.tasks.filter(task => task.completed);
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-[45px] p-1 border-r border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    ${!day.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                    ${day.isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600' : ''}
                    ${day.tasks.length > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
                  `}
                >
                  <div className="text-xs font-medium mb-0.5">
                    {day.date.getDate()}
                  </div>
                  
                  {/* Task Indicators */}
                  <div className="space-y-0.5">
                    {pendingTasks.length > 0 && (
                      <div className="flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        {pendingTasks.length > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">
                            {pendingTasks.length}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {completedTasks.length > 0 && (
                      <div className="flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        {completedTasks.length > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">
                            {completedTasks.length}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span>{t('calendar.pending')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span>{t('calendar.completed')}</span>
          </div>
        </div>
      </div>

      {/* Day Tasks Modal */}
      <DayTasksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDay || new Date()}
        tasks={getTasksForSelectedDay()}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
      />
      
      <VoiceButton />
    </div>
  );
};

export default CalendarPage; 