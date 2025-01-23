import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, Settings, HelpCircle, Bot, FileUp, Brain, Headphones, Zap, Globe, Clock, MessageSquare } from 'lucide-react';
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
    { path: '/dashboard', icon: FileText, label: 'Dashboard' },
    { path: '/ai-assistance', icon: Bot, label: 'AI Assistance' },
    { path: '/smart-classification', icon: Brain, label: 'Smart Classification' },
    { path: '/real-time-support', icon: Headphones, label: 'Real-time Support' },
    { path: '/quick-resolution', icon: Zap, label: 'Quick Resolution' },
    { path: '/multi-lingual', icon: Globe, label: 'Multi-lingual' },
    { path: '/staff', icon: Users, label: 'Staff' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/feedback-form', icon: MessageSquare, label: 'Feedback Form' }
  ];

  const sidebarBg = theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-700';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-indigo-600';
  const activeBg = theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-800';

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 ${sidebarBg} text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <div className="space-y-6 p-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path ? activeBg : hoverBg
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