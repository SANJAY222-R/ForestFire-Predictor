import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightColors, darkColors, fallbackColors } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

// Validate colors object to ensure all required properties exist
const validateColors = (colors) => {
  const requiredProperties = [
    'primary', 'secondary', 'background', 'surface', 'text', 'textSecondary',
    'textLight', 'highRisk', 'moderateRisk', 'lowRisk', 'success', 'warning',
    'error', 'info', 'cardBackground', 'shadow', 'border', 'userMessage',
    'aiMessage', 'overlay', 'disabled', 'placeholder', 'tabBarBackground',
    'tabBarActive', 'tabBarInactive', 'drawerBackground', 'drawerActiveItem',
    'drawerInactiveItem'
  ];

  const validatedColors = { ...fallbackColors };
  
  requiredProperties.forEach(prop => {
    if (colors && colors[prop] !== undefined) {
      validatedColors[prop] = colors[prop];
    }
  });

  return validatedColors;
};

// Custom hook to safely use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      isDark: false,
      toggleTheme: () => {},
      colors: validateColors(fallbackColors),
      setTheme: () => {},
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_preference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    try {
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const setTheme = async (darkMode) => {
    setIsDark(darkMode);
    
    try {
      await AsyncStorage.setItem('theme_preference', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };
  
  // Ensure colors object is always available with fallback
  const rawColors = isDark ? darkColors : lightColors;
  
  // Validate that colors object exists and has required properties
  const validatedColors = validateColors(rawColors);

  const themeValue = {
    isDark,
    toggleTheme,
    setTheme,
    colors: validatedColors,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};
