import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import SmartClassification from './pages/SmartClassification';
import RealTimeSupportWrapper from './wrappers/RealTimeSupportWrapper';
import QuickResolutionWrapper from './wrappers/QuickResolutionWrapper';
import MultiLingualWrapper from './wrappers/MultiLingualWrapper';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import '../../frontend/src/styles/translate.css';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check both isAuthenticated flag and adminToken to ensure proper authentication
  const isAuthenticated = 
    localStorage.getItem('isAuthenticated') === 'true' && 
    localStorage.getItem('adminToken') !== null;
    
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check localStorage for theme preference and apply it immediately
    const theme = localStorage.getItem('theme') || localStorage.getItem('adminTheme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeInitializer>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="smart-classification" element={<SmartClassification />} />
              <Route path="real-time-support" element={<RealTimeSupportWrapper />} />
              <Route path="quick-resolution" element={<QuickResolutionWrapper />} />
              <Route path="multi-lingual" element={<MultiLingualWrapper />} />
              <Route path="staff" element={<Staff />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </ThemeProvider>
    </ThemeInitializer>
  );
};

export default App;
