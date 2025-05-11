import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activityStatus: true
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="space-y-8">
          {/* Theme Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4">Theme</h2>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <span>Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4">Notifications</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="capitalize">{key} Notifications</span>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${value ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${value ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4">Privacy</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <label className="block mb-2">Profile Visibility</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span>Show Activity Status</span>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, activityStatus: !prev.activityStatus }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${privacy.activityStatus ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${privacy.activityStatus ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;