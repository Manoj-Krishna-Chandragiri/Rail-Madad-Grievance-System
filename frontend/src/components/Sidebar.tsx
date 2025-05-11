import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings, HelpCircle, Bot, FileUp, Brain, Headphones, Zap, Globe, Clock, MessageSquare, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || localStorage.getItem('userRole') === 'admin';

  const allMenuItems = [
    { path: '/', icon: Home, label: 'Home', showFor: 'both' },
    { path: '/file-complaint', icon: FileUp, label: 'File Complaint', showFor: 'passenger' },
    { path: '/track-status', icon: Clock, label: 'Track Status', showFor: 'passenger' },
    { path: '/dashboard', icon: BarChart2, label: 'Dashboard', showFor: 'admin' },
    { path: '/ai-assistance', icon: Bot, label: 'AI Assistance', showFor: 'passenger' },
    { path: '/smart-classification', icon: Brain, label: 'Smart Classification', showFor: 'admin' },
    { path: '/real-time-support', icon: Headphones, label: 'Real-time Support', showFor: 'both' },
    { path: '/quick-resolution', icon: Zap, label: 'Quick Resolution', showFor: 'admin' },
    { path: '/multi-lingual', icon: Globe, label: 'Multi-lingual', showFor: 'both' },
    { path: '/staff', icon: Users, label: 'Staff Management', showFor: 'admin' },
    { path: '/feedback-form', icon: MessageSquare, label: 'Feedback Form', showFor: 'passenger' },
    { path: '/help', icon: HelpCircle, label: 'Help', showFor: 'passenger' },
    { path: '/settings', icon: Settings, label: 'Settings', showFor: 'both' }
  ];

  const menuItems = allMenuItems.filter(item => 
    item.showFor === 'both' || 
    (isAdmin && item.showFor === 'admin') || 
    (!isAdmin && item.showFor === 'passenger')
  );

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