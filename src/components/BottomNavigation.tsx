import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAVIGATION_ITEMS } from '../config/constants';
import { TaskIcon, CalendarIcon, SettingsIcon } from './Icons';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="w-6 h-6 mb-1">
                {item.id === 'list' && (
                  <TaskIcon 
                    className={`w-full h-full ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                )}
                {item.id === 'calendar' && (
                  <CalendarIcon 
                    className={`w-full h-full ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                )}
                {item.id === 'settings' && (
                  <SettingsIcon 
                    className={`w-full h-full ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                )}
              </div>
              <span className="text-xs font-medium">
                {item.id === 'list' && t('navigation.tasks')}
                {item.id === 'calendar' && t('navigation.calendar')}
                {item.id === 'settings' && t('navigation.settings')}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation; 