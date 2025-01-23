import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Router>
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
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ai-assistance" element={<AIAssistance />} />
              <Route path="file-complaint" element={<FileComplaint />} />
              <Route path="track-status" element={<TrackStatus />} />
              <Route path="smart-classification" element={<SmartClassification />} />
              <Route path="real-time-support" element={<RealTimeSupport />} />
              <Route path="quick-resolution" element={<QuickResolution />} />
              <Route path="multi-lingual" element={<MultiLingual />} />
              <Route path="staff" element={<Staff />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              <Route path="feedback-form" element={<FeedbackForm />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;