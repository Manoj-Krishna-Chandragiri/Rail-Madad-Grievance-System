import { Bell, User, Menu, Search, Settings, LogOut, ChevronDown, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
      // Check if click is outside search dropdown
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when search dropdown opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = () => {
    // Clear both authentication tokens to ensure proper logout
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const clearNotifications = () => {
    setHasUnreadNotifications(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setShowSearch(false);
    // Implement search functionality here
  };

  const notifications = [
    {
      id: 1,
      message: 'New complaint assigned: #CMP123',
      time: '2 minutes ago',
      isRead: false,
      type: 'assignment',
    },
    {
      id: 2,
      message: 'Complaint #CMP120 resolved',
      time: '1 hour ago',
      isRead: true,
      type: 'resolution',
    },
    {
      id: 3,
      message: 'New staff member added',
      time: '3 hours ago',
      isRead: true,
      type: 'staff',
    }
  ];

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md px-4 py-2 w-full transition-colors duration-300`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 z-50">
          <button 
            onClick={toggleSidebar} 
            className={`p-2 rounded-lg transition-colors duration-300 ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 active:bg-gray-600' 
                : 'hover:bg-gray-100 active:bg-gray-200'
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://railmadad-dashboard.web.app/assets/logo-railmadad-B9R2Xeqc.png" 
              alt="Rail Madad" 
              className="h-8 transition-transform duration-300 hover:scale-105" 
            />
            <h1 className="text-xl font-semibold hidden md:block">Rail Madad Admin</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search button */}
          <div className="relative" ref={searchRef}>
            <button 
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors duration-300`}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {showSearch && (
              <form 
                onSubmit={handleSearchSubmit}
                className={`absolute right-0 top-full mt-2 w-80 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } p-3 z-50 animate-fadeIn`}
              >
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-3 pr-10 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:ring-2 focus:ring-indigo-200 transition-all`}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Press Enter to search
                </div>
              </form>
            )}
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors duration-300 relative`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) clearNotifications();
              }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-lg border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } p-4 z-50 animate-fadeIn`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Notifications</h3>
                  <button 
                    className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                    onClick={clearNotifications}
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div className={`max-h-60 overflow-y-auto ${theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                  {notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg transition-colors duration-200 cursor-pointer ${
                            !notification.isRead ? (theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50') : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`shrink-0 p-2 mr-3 rounded-full ${
                              notification.type === 'assignment' 
                                ? (theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100') 
                                : notification.type === 'resolution'
                                  ? (theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100')
                                  : (theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100')
                            }`}>
                              {notification.type === 'assignment' && <Bell className="h-4 w-4 text-blue-500" />}
                              {notification.type === 'resolution' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {notification.type === 'staff' && <User className="h-4 w-4 text-purple-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{notification.message}</p>
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.time}
                              </span>
                            </div>
                            {!notification.isRead && (
                              <span className="shrink-0 h-2 w-2 bg-indigo-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="w-full py-2 text-sm text-center text-indigo-500 hover:text-indigo-600 transition-colors"
                    onClick={() => navigate('/notifications')}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              className={`flex items-center gap-2 py-1 px-2 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } rounded-lg transition-colors duration-300`}
              onClick={() => setShowProfile(!showProfile)}
              aria-label="User Profile"
            >
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-700" />
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showProfile && (
              <div className={`absolute right-0 mt-2 w-64 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-lg border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } p-4 z-50 animate-fadeIn`}>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <div className="font-semibold">Rail Admin</div>
                    <div className="text-xs text-gray-500">adm.railmadad@gmail.com</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button
                    className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      navigate('/profile');
                      setShowProfile(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">My Profile</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      navigate('/settings');
                      setShowProfile(false);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
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
