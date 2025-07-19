import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.tsx';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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