import { useState, useEffect } from 'react';
import { User, Settings, Shield, Edit, Lock, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface AdminData {
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  address: string;
}

const Profile = () => {
  const { theme } = useTheme();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // For demo purposes, use either hardcoded admin data or load from localStorage
        const isAdmin = localStorage.getItem('userRole') === 'admin';
        const adminToken = localStorage.getItem('adminToken');
        
        if (!isAdmin || !adminToken) {
          throw new Error('Not authenticated as admin');
        }

        // In a real application, we would fetch this from an API:
        // We'll simulate a successful API response for now
        // This is a workaround until the backend API is properly set up
        const mockAdminData = {
          full_name: "Rail Madad Admin",
          email: "adm.railmadad@gmail.com",
          phone_number: "+91 9876543210",
          gender: "Not specified",
          address: "Indian Railways HQ, New Delhi"
        };
        
        setAdminData(mockAdminData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load profile. Please make sure you are logged in as an admin.');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg`}>
        {error ? (
          <div className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'}`}>
              <User className={`h-8 w-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {error}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : adminData ? (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
              {/* Profile avatar */}
              <div className="flex flex-col items-center">
                <div className={`relative w-32 h-32 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <User className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className="mt-4 text-center">
                  <h1 className="text-xl font-bold">{adminData.full_name}</h1>
                  <p className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    Administrator
                  </p>
                </div>
              </div>

              {/* Profile information */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Admin Information
                </h2>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Email Address
                        </p>
                        <p className="font-medium">{adminData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Phone Number
                        </p>
                        <p className="font-medium">{adminData.phone_number}</p>
                      </div>
                    </div>
                  </div>
                  
                  {adminData.gender && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <User className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Gender
                          </p>
                          <p className="font-medium">{adminData.gender}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {adminData.address && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Address
                          </p>
                          <p className="font-medium">{adminData.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Admin Settings
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}>
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>
                </div>
              </div>

              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                <h2 className={`text-lg font-semibold flex items-center gap-2 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  <Shield className="h-5 w-5" />
                  Security Settings
                </h2>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
