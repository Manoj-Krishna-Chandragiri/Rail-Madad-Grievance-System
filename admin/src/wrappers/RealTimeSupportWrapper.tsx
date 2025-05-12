import React, { useEffect } from 'react';
import { ThemeProvider as FrontendThemeProvider } from '../../../frontend/src/context/ThemeContext';
import RealTimeSupportComponent from '../../../frontend/src/pages/RealTimeSupport';
import { useTheme } from '../context/ThemeContext';

/**
 * This wrapper ensures the frontend component has access to its required ThemeProvider
 * and syncs the theme with the admin theme
 */
const RealTimeSupportWrapper = () => {
  const { theme } = useTheme(); // Get theme from admin context
  
  // Sync admin theme with frontend storage before rendering component
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <FrontendThemeProvider>
      <RealTimeSupportComponent />
    </FrontendThemeProvider>
  );
};

export default RealTimeSupportWrapper;
