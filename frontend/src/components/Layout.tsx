import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} relative`}>
      {/* Fixed navbar with higher z-index */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Sidebar with lower z-index than navbar */}
      <div className="fixed left-0 top-0 z-40 h-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content with top padding for navbar and left margin for sidebar */}
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;