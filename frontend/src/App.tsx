import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import AIAssistance from './pages/AIAssistance';
import FileComplaint from './pages/FileComplaint.tsx';
import SmartClassification from './pages/SmartClassification';
import RealTimeSupport from './pages/RealTimeSupport';
import QuickResolution from './pages/QuickResolution';
import MultiLingual from './pages/MultiLingual';
import TrackStatus from './pages/TrackStatus';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import Help from './pages/Help';
import FeedbackForm from './pages/FeedbackForm.tsx';
import Profile from './pages/Profile';
import './styles/translate.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
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
            {/* Common Routes */}
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="real-time-support" element={<RealTimeSupport />} />
            <Route path="multi-lingual" element={<MultiLingual />} />

            {/* Admin Routes */}
            <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="smart-classification" element={<AdminRoute><SmartClassification /></AdminRoute>} />
            <Route path="real-time-support" element={<AdminRoute><RealTimeSupport /></AdminRoute>} />
            <Route path="quick-resolution" element={<AdminRoute><QuickResolution /></AdminRoute>} />
            <Route path="multi-lingual" element={<AdminRoute><MultiLingual /></AdminRoute>} />
            <Route path="staff" element={<AdminRoute><Staff /></AdminRoute>} />

            {/* Passenger Routes */}
            <Route path="file-complaint" element={<FileComplaint />} />
            <Route path="track-status" element={<TrackStatus />} />
            <Route path="ai-assistance" element={<AIAssistance />} />
            <Route path="help" element={<Help />} />
            <Route path="feedback-form" element={<FeedbackForm />} />
          </Route>
        </Routes>
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default App;