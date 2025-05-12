import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  autoAssign: boolean;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const defaultSettings: Settings = {
  notifications: true,
  emailAlerts: true,
  autoAssign: true
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for shared theme setting between admin and frontend
    const savedTheme = localStorage.getItem('theme') || localStorage.getItem('adminTheme');
    return (savedTheme as Theme) || 'light';
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    // Store theme in both admin-specific and shared storage
    localStorage.setItem('adminTheme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};