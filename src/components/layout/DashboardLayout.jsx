// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import Header from './header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
              {/* Main content goes here */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;