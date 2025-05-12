import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, HelpCircle, Bot, FileUp, Globe, Clock, MessageSquare, Headphones } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/file-complaint', icon: FileUp, label: 'File Complaint' },
    { path: '/track-status', icon: Clock, label: 'Track Status' },
    { path: '/ai-assistance', icon: Bot, label: 'AI Assistance' },
    { path: '/real-time-support', icon: Headphones, label: 'Real-time Support' },
    { path: '/multi-lingual', icon: Globe, label: 'Multi-lingual' },
    { path: '/feedback-form', icon: MessageSquare, label: 'Feedback Form' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className={`fixed left-0 h-full w-64 pt-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-700'} text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <div className="space-y-6 p-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-800'
                      : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;