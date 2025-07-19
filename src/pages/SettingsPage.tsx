import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Settings
        </h1>
        <div className="text-center text-gray-500">
          <p>Settings view will be implemented here</p>
          <p className="text-sm mt-2">This page will contain app preferences and configuration</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 