import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme, settings: globalSettings, updateSettings } = useTheme();
  const [localSettings, setLocalSettings] = useState(globalSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(globalSettings);
  }, [globalSettings]);

  const handleChange = (key: string, value: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          <div className="border-b dark:border-gray-700 pb-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about complaints</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localSettings.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">Email Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localSettings.emailAlerts}
                    onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="border-b dark:border-gray-700 pb-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="border-b dark:border-gray-700 pb-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Complaint Management</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium dark:text-white">Auto-assign Complaints</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically assign complaints to available staff</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.autoAssign}
                  onChange={(e) => handleChange('autoAssign', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {saved && (
                <span className="text-green-600 dark:text-green-400">
                  Settings saved successfully!
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;