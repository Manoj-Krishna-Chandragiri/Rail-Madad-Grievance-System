import React from 'react';
import { ThemeProvider as FrontendThemeProvider } from '../../../frontend/src/context/ThemeContext';
import ProfileComponent from '../../../frontend/src/pages/Profile';

/**
 * This wrapper ensures the frontend component has access to its required ThemeProvider
 */
const ProfileWrapper = () => {
  return (
    <FrontendThemeProvider>
      <ProfileComponent />
    </FrontendThemeProvider>
  );
};

export default ProfileWrapper;
