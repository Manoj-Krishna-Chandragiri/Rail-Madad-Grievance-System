import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AIAssistance from './pages/AIAssistance';
import FileComplaint from './pages/FileComplaint.tsx';
import MultiLingual from './pages/MultiLingual';
import TrackStatus from './pages/TrackStatus';
import Settings from './pages/Settings';
import Help from './pages/Help';
import FeedbackForm from './pages/FeedbackForm.tsx';
import Profile from './pages/Profile';
import './styles/translate.css';
import RealTimeSupport from './pages/RealTimeSupport';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Passenger Routes */}
            <Route index element={<Home />} />
            <Route path="file-complaint" element={<FileComplaint />} />
            <Route path="track-status" element={<TrackStatus />} />
            <Route path="ai-assistance" element={<AIAssistance />} />
            <Route path="real-time-support" element={<RealTimeSupport />} />
            <Route path="quick-resolution" element={<RealTimeSupport />} />
            <Route path="multi-lingual" element={<MultiLingual />} />
            <Route path="help" element={<Help />} />
            <Route path="feedback-form" element={<FeedbackForm />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default App;