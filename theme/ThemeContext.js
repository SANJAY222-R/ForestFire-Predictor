import React, { createContext, useState, useContext } from 'react';
import { lightColors, darkColors } from './colors';

export const ThemeContext = createContext();

// Custom hook to safely use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default values if context is not available
    return {
      isDark: false,
      toggleTheme: () => {},
      colors: lightColors,
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Light mode default

  const toggleTheme = () => setIsDark((prev) => !prev);
  const colors = isDark ? darkColors : lightColors;

  // Ensure colors object is always available
  const themeValue = {
    isDark,
    toggleTheme,
    colors: colors || lightColors, // Fallback to light colors if undefined
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};
