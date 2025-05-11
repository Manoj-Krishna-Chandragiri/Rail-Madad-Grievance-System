import { HelpCircle, Book, Phone, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Help = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Help & Support</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${
            theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
          } rounded-lg p-6`}>
            <Book className="h-8 w-8 text-indigo-400 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Documentation</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Find detailed guides and documentation about using the Rail Madad system.
            </p>
            <button className="text-indigo-400 hover:text-indigo-300">
              View Documentation →
            </button>
          </div>

          <div className={`${
            theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
          } rounded-lg p-6`}>
            <Phone className="h-8 w-8 text-indigo-400 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Get in touch with our support team for assistance.
            </p>
            <button className="text-indigo-400 hover:text-indigo-300">
              Contact Support →
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className={`${
              theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
            } rounded-lg p-4`}>
              <summary className="font-medium cursor-pointer">
                How do I file a new complaint?
              </summary>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                To file a new complaint, click on the "File Complaint" option in the sidebar menu. Fill in the required details about your complaint and submit the form.
              </p>
            </details>

            <details className={`${
              theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
            } rounded-lg p-4`}>
              <summary className="font-medium cursor-pointer">
                How can I track my complaint status?
              </summary>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                You can track your complaint status by clicking on the "Track Status" option in the sidebar menu. Enter your complaint ID or PNR number to view the current status.
              </p>
            </details>

            <details className={`${
              theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
            } rounded-lg p-4`}>
              <summary className="font-medium cursor-pointer">
                What are the supported languages?
              </summary>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Rail Madad supports multiple Indian languages including Hindi, Bengali, Telugu, Tamil, and more. You can change the language from the settings menu.
              </p>
            </details>
          </div>
        </div>

        <div className={`mt-8 p-6 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        } rounded-lg`}>
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="font-medium">Helpline</p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  139 (Toll Free)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  support@railmadad.indianrailways.gov.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;