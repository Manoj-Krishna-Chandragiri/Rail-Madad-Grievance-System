import React from 'react';
import { ThemeProvider as FrontendThemeProvider } from '../../../frontend/src/context/ThemeContext';
import QuickResolutionComponent from '../../../frontend/src/pages/QuickResolution';

/**
 * This wrapper ensures the frontend component has access to its required ThemeProvider
 */
const QuickResolutionWrapper = () => {
  return (
    <FrontendThemeProvider>
      <QuickResolutionComponent />
    </FrontendThemeProvider>
  );
};

export default QuickResolutionWrapper;
