import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.tsx';
import Logo from './Logo.tsx';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Logo */}
      <Logo />
      
      {/* Main content area */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout; 