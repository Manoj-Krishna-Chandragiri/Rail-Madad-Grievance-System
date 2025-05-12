import React from 'react';
import { ThemeProvider as FrontendThemeProvider } from '../../../frontend/src/context/ThemeContext';
import MultiLingualComponent from '../../../frontend/src/pages/MultiLingual';

/**
 * This wrapper ensures the frontend component has access to its required ThemeProvider
 */
const MultiLingualWrapper = () => {
  return (
    <FrontendThemeProvider>
      <MultiLingualComponent />
    </FrontendThemeProvider>
  );
};

export default MultiLingualWrapper;
