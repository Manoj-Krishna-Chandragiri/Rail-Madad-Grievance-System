import { Link } from 'react-router-dom';
import { FileUp, Search, HelpCircle, Bot, Globe, Headphones, BarChart2, Brain, Zap, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminView = ({ theme }: { theme: string }) => (
  <>
    <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Link 
        to="/dashboard" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <BarChart2 className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>View analytics & stats</p>
      </Link>

      <Link 
        to="/smart-classification" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Brain className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Smart Classification</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>AI-powered sorting</p>
      </Link>

      <Link 
        to="/quick-resolution" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Zap className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Quick Resolution</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Fast complaint handling</p>
      </Link>

      <Link 
        to="/staff" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Users className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Staff Management</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Manage staff members</p>
      </Link>
    </div>
  </>
);

const PassengerView = ({ theme }: { theme: string }) => (
  <>
    <h1 className="text-3xl font-bold text-center mb-8">Welcome to Rail Madad</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Link 
        to="/file-complaint" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <FileUp className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">File Complaint</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Submit a new complaint</p>
      </Link>

      <Link 
        to="/track-status" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Search className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Track Status</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Check complaint status</p>
      </Link>

      <Link 
        to="/ai-assistance" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Bot className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">AI Assistance</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get AI-powered help</p>
      </Link>

      <Link 
        to="/help" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <HelpCircle className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Help</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get support</p>
      </Link>

      <Link 
        to="/real-time-support" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Headphones className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Real-time Support</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get live assistance</p>
      </Link>

      <Link 
        to="/multi-lingual" 
        className={`flex flex-col items-center p-6 rounded-lg hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border hover:bg-gray-50'
        }`}
      >
        <Globe className="h-12 w-12 text-indigo-400 mb-4" />
        <h2 className="text-lg font-semibold">Multi-lingual</h2>
        <p className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Language support</p>
      </Link>
    </div>
  </>
);

const Home = () => {
  const { theme } = useTheme();
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        {isAdmin ? <AdminView theme={theme} /> : <PassengerView theme={theme} />}
        
        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            {isAdmin 
              ? "Manage and monitor the Rail Madad system efficiently. Track complaints, analyze patterns, and ensure quick resolution."
              : "Rail Madad is an integrated helpline for Indian Railways passengers. It provides a single interface for passenger grievance redressal and enquiry during train journeys."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">{isAdmin ? 'Analytics' : '24/7 Support'}</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {isAdmin ? 'Real-time statistics and insights' : 'Round-the-clock assistance for passengers'}
              </p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">Quick Resolution</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {isAdmin ? 'Efficient complaint management' : 'Fast and efficient complaint resolution'}
              </p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">{isAdmin ? 'Staff Management' : 'Multi-lingual'}</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {isAdmin ? 'Coordinate staff and assignments' : 'Support in multiple Indian languages'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;