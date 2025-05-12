import React from 'react';
import { useTheme as useAdminTheme } from '../../context/ThemeContext';

// Create a context to pass our admin theme to frontend components
export const AdminThemeContext = React.createContext<{theme: 'light' | 'dark'}>({ theme: 'light' });

// This HOC (Higher Order Component) wraps any frontend component to provide the admin theme context
export const withAdminTheme = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  // Create a new component that wraps the original with the admin theme context
  const WrappedComponent: React.FC<P> = (props) => {
    const { theme } = useAdminTheme();
    
    return (
      <AdminThemeContext.Provider value={{ theme }}>
        <Component {...props as P} />
      </AdminThemeContext.Provider>
    );
  };

  // Set the display name for better debugging
  WrappedComponent.displayName = `withAdminTheme(${componentName})`;
  
  return WrappedComponent;
};
