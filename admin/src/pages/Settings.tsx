import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Bell, Mail, Database, Lock, Eye, Shield, Monitor } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    complaints: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoAssignTickets: true,
    autoCloseResolvedTickets: true,
    dataRetentionDays: 90,
    enableAuditLog: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: 30
  });

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Admin Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Theme Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-indigo-400" />
              Display
            </h2>
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
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-400" />
              Notifications
            </h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} Notifications</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === 'email' ? 'Receive notifications via email' : 
                       key === 'push' ? 'Receive push notifications in browser' : 
                       key === 'updates' ? 'Get system update notifications' :
                       'Get alerts for new complaints'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
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

          {/* System Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              System Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <span>Auto-assign tickets</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically assign new tickets to available staff</p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange('autoAssignTickets', !systemSettings.autoAssignTickets)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
                    ${systemSettings.autoAssignTickets ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${systemSettings.autoAssignTickets ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <span>Auto-close resolved tickets</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Close tickets automatically after 7 days of resolution</p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange('autoCloseResolvedTickets', !systemSettings.autoCloseResolvedTickets)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
                    ${systemSettings.autoCloseResolvedTickets ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${systemSettings.autoCloseResolvedTickets ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span>Data retention period (days)</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How long to keep complaint data</p>
                  </div>
                  <span className="font-semibold">{systemSettings.dataRetentionDays} days</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="30"
                  value={systemSettings.dataRetentionDays}
                  onChange={(e) => handleSystemSettingChange('dataRetentionDays', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>30 days</span>
                  <span>1 year</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <span>Enable audit logging</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Log all admin actions for security purposes</p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange('enableAuditLog', !systemSettings.enableAuditLog)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
                    ${systemSettings.enableAuditLog ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${systemSettings.enableAuditLog ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <span>Require two-factor authentication</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enhance account security with 2FA</p>
                </div>
                <button
                  onClick={() => setSecuritySettings(prev => ({ ...prev, requireTwoFactor: !prev.requireTwoFactor }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
                    ${securitySettings.requireTwoFactor ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${securitySettings.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span>Session timeout (minutes)</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically log out after inactivity</p>
                  </div>
                  <span className="font-semibold">{securitySettings.sessionTimeout} min</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5 min</span>
                  <span>2 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Settings Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
