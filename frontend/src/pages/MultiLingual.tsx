import { Globe, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface TranslatedContent {
  id: string;
  category: string;
  original: string;
  translated: string;
  language: string;
  lastUpdated: string;
}

const MultiLingual = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' }
  ];

  const translatedContent: TranslatedContent[] = [
    {
      id: '1',
      category: 'Navigation',
      original: 'File Complaint',
      translated: 'शिकायत दर्ज करें',
      language: 'hi',
      lastUpdated: '2024-03-10'
    },
    {
      id: '2',
      category: 'Navigation',
      original: 'Track Status',
      translated: 'स्थिति देखें',
      language: 'hi',
      lastUpdated: '2024-03-10'
    }
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Multi-lingual Support</h1>
        </div>

        <div className="mb-8">
          <div className="relative">
            <button
              className={`w-full flex items-center justify-between p-3 border ${
                isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              } rounded-lg`}
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <div className="flex items-center gap-2">
                <span>{selectedLang?.flag}</span>
                <span>{selectedLang?.name}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>({selectedLang?.nativeName})</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showLanguageSelector ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageSelector && (
              <div className={`absolute w-full mt-2 ${
                isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              } border rounded-lg shadow-lg z-10`}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`w-full flex items-center gap-2 p-3 ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>({lang.nativeName})</span>
                    {selectedLanguage === lang.code && (
                      <Check className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`border ${isDark ? 'border-gray-600' : 'border-gray-200'} rounded-lg overflow-hidden`}>
            <table className="w-full">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>Category</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>Original Text</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>Translated Text</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>Last Updated</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-600' : 'divide-gray-200'}`}>
                {translatedContent.map(content => (
                  <tr key={content.id} className={isDark ? 'bg-gray-800' : 'bg-white'}>
                    <td className="px-4 py-3">{content.category}</td>
                    <td className="px-4 py-3">{content.original}</td>
                    <td className="px-4 py-3">{content.translated}</td>
                    <td className="px-4 py-3">{content.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
            <h2 className="font-semibold mb-2">Translation Progress</h2>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLingual;