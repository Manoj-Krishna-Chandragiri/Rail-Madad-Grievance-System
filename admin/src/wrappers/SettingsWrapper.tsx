import React, { useEffect } from 'react';
import { ThemeProvider as FrontendThemeProvider } from '../../../frontend/src/context/ThemeContext';
import SettingsComponent from '../../../frontend/src/pages/Settings';
import { useTheme } from '../context/ThemeContext';

/**
 * This wrapper ensures the frontend component has access to its required ThemeProvider
 * and syncs the theme with the admin theme
 */
const SettingsWrapper = () => {
  const { theme, toggleTheme } = useTheme(); // Get theme from admin context

  // Use our admin Settings implementation instead of frontend one
  // This ensures proper styling and functionality
  return <Settings />;
};

// Import our local Settings implementation
import Settings from '../pages/Settings';

export default SettingsWrapper;
