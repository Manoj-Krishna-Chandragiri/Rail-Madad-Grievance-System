import { Link } from 'react-router-dom';
import { FileUp, Search, HelpCircle, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
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
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4">About Rail Madad</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Rail Madad is an integrated helpline for Indian Railways passengers. It provides a single interface for passenger grievance redressal and enquiry during train journeys.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Round-the-clock assistance for passengers</p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">Quick Resolution</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Fast and efficient complaint resolution</p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-2">Multi-lingual</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Support in multiple Indian languages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;