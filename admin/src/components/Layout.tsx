import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate page loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} relative transition-colors duration-300`}>
      {/* Fixed navbar with higher z-index */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Sidebar with lower z-index than navbar */}
      <div className="fixed left-0 top-0 z-40 h-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content with top padding for navbar and left margin for sidebar */}
      <main 
        className={`pt-16 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } ${
          isPageLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Loader overlay */}
      {isPageLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </div>
  );
};

export default Layout;
