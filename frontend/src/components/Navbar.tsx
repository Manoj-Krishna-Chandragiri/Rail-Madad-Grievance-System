import React, { useState, useEffect, useRef } from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside notifications dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      // Check if click is outside profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md p-4 w-full`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 z-50">
          <button onClick={toggleSidebar} className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <img src="https://railmadad-dashboard.web.app/assets/logo-railmadad-B9R2Xeqc.png" alt="Rail Madad" className="h-8" />
          <h1 className="text-xl font-semibold">Rail Madad Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationsRef}>
            <button 
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border border-gray-700 p-4 z-50`}>
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded`}>
                    <p className="text-sm">New complaint assigned: #CMP123</p>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>2 minutes ago</span>
                  </div>
                  <div className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded`}>
                    <p className="text-sm">Complaint #CMP120 resolved</p>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <button 
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="h-5 w-5" />
            </button>
            {showProfile && (
              <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border border-gray-700 p-4 z-50`}>
                <div className="space-y-2">
                  <div className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded cursor-pointer`}
                    onClick={() => navigate('/profile')}
                  >
                    <p className="text-sm font-medium">My Profile</p>
                  </div>
                  <div className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded cursor-pointer`}
                    onClick={() => navigate('/settings')}
                  >
                    <p className="text-sm font-medium">Settings</p>
                  </div>
                  <div 
                    className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded cursor-pointer`}
                    onClick={handleLogout}
                  >
                    <p className="text-sm font-medium text-red-600">Logout</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;