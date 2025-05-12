import { Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

// Simplified version of the frontend component using the admin ThemeContext
const MultiLingual = () => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'ur', name: 'Urdu', native: 'اردو' }
  ];

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Change language function
  const changeLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowDropdown(false);
    
    // Use Google Translate API to change the language
    const langSelector = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (langSelector) {
      langSelector.value = langCode;
      langSelector.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) return;
      
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,ur', 
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        
        // Hide the default Google Translate widget
        setTimeout(() => {
          const googleElement = document.getElementById('google_translate_element');
          if (googleElement) {
            googleElement.style.visibility = 'hidden';
            googleElement.style.position = 'absolute';
            googleElement.style.top = '-9999px';
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    addScript();

    // Cleanup
    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  const getSelectedLanguageName = () => {
    const lang = languages.find(lang => lang.code === selectedLanguage);
    return lang ? `${lang.name} (${lang.native})` : 'English';
  };

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
              Choose from a variety of Indian languages to view the admin dashboard in your preferred language.
            </p>
            
            {/* Custom language selector dropdown */}
            <div className="relative mb-4" ref={dropdownRef}>
              <div 
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  <span>{getSelectedLanguageName()}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} />
              </div>
              
              {showDropdown && (
                <div className={`absolute z-10 mt-1 w-full rounded-lg border shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="max-h-60 overflow-y-auto">
                    {languages.map(lang => (
                      <div
                        key={lang.code}
                        className={`p-3 flex items-center gap-2 cursor-pointer ${
                          selectedLanguage === lang.code
                            ? theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-50'
                            : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="font-medium">{lang.name}</span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang.native}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Hidden Google Translate element */}
            <div className="google-translate-container">
              <div id="google_translate_element"></div>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Translating the admin dashboard might affect some functionality. 
                For best experience, use English in technical areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLingual;
