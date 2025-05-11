import { Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

const MultiLingual = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,ur,as,or,sa,ne,sd', // Added 'en' for English
          layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          autoDisplay: false,
          multilanguagePage: false
        },
        'google_translate_element'
      );
    };

    addScript();

    // Cleanup
    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Language Settings</h1>
        </div>

        <div className="space-y-6">
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <h2 className="text-lg font-semibold mb-4">Select Your Preferred Language</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose from a variety of Indian languages to view the website in your preferred language.
              The translation will be applied across all pages of the Rail Madad portal.
            </p>
            {/* Add styling container for Google Translate */}
            <div className="google-translate-container">
              <div id="google_translate_element"></div>
            </div>
          </div>

          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <h2 className="text-lg font-semibold mb-4">Supported Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Primary Language</h3>
                <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>English (English)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">North Indian Languages</h3>
                <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Hindi (हिंदी)</li>
                  <li>Punjabi (ਪੰਜਾਬੀ)</li>
                  <li>Urdu (اردو)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">South Indian Languages</h3>
                <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Tamil (தமிழ்)</li>
                  <li>Telugu (తెలుగు)</li>
                  <li>Malayalam (മലയാളം)</li>
                  <li>Kannada (ಕನ್ನಡ)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Other Indian Languages</h3>
                <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Assamese (অসমীয়া)</li>
                  <li>Odia (ଓଡ଼ିଆ)</li>
                  <li>Sanskrit (संस्कृतम्)</li>
                  <li>Nepali (नेपाली)</li>
                  <li>Sindhi (سنڌي)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <h2 className="text-lg font-semibold mb-4">Language Support Information</h2>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Translations are provided through Google Translate service</li>
              <li>• Some technical terms may remain in English</li>
              <li>• Your language preference will be saved for future visits</li>
              <li>• For best results, ensure your browser is up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLingual;