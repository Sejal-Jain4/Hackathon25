// This service manages the app's theming and appearance

export type ThemeType = 'light' | 'dark' | 'system';

export interface Theme {
  id: ThemeType;
  name: string;
  colors: {
    // Core colors
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    
    // Specific components
    statusBar: string;
    tabBar: string;
    tabBarInactive: string;
    tabBarBorder: string;
    progressBar: string;
    shadow: string;
  };
}

// Light theme
export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  colors: {
    primary: '#5B37B7',
    secondary: '#3E2A87',
    accent: '#E8682B',
    background: '#F5F5F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#121212',
    textSecondary: '#6C757D',
    border: '#EEEEEE',
    notification: '#FF4081',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
    
    statusBar: '#5B37B7',
    tabBar: '#FFFFFF',
    tabBarInactive: '#A9A9A9',
    tabBarBorder: '#EEEEEE',
    progressBar: '#5B37B7',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

// Dark theme
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  colors: {
    primary: '#7E57C2',
    secondary: '#5E35B1',
    accent: '#FF7D51',
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    notification: '#FF4081',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFEB3B',
    info: '#2196F3',
    
    statusBar: '#121212',
    tabBar: '#1E1E1E',
    tabBarInactive: '#777777',
    tabBarBorder: '#333333',
    progressBar: '#7E57C2',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Create a basic theme context for sharing theme data across the app
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ColorSchemeName, useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@centisi_app_theme';

type ThemeContextType = {
  theme: Theme;
  themeType: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeType: (type: ThemeType) => void;
};

const defaultContext: ThemeContextType = {
  theme: lightTheme,
  themeType: 'system',
  isDark: false,
  toggleTheme: () => {},
  setThemeType: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  
  // Determine if we should use dark mode
  const isDark = 
    themeType === 'dark' || (themeType === 'system' && deviceTheme === 'dark');
  
  // Set the active theme based on preferences
  const theme = isDark ? darkTheme : lightTheme;
  
  // Toggle between light and dark
  const toggleTheme = () => {
    const newThemeType = isDark ? 'light' : 'dark';
    setThemeType(newThemeType);
    saveThemePreference(newThemeType);
  };
  
  // Set specific theme type
  const setThemeTypeHandler = (type: ThemeType) => {
    setThemeType(type);
    saveThemePreference(type);
  };
  
  // Save theme preference to storage
  const saveThemePreference = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  };
  
  // Load saved theme preference on startup
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        isDark,
        toggleTheme,
        setThemeType: setThemeTypeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for accessing the theme
export const useTheme = () => useContext(ThemeContext);

// Helper functions for working with themes
export const ThemeService = {
  // Get available themes
  getAvailableThemes: (): Theme[] => {
    return [lightTheme, darkTheme];
  },
  
  // Generate dynamic opacity version of a color
  withOpacity: (color: string, opacity: number): string => {
    // For simplicity in the hackathon, we'll just assume hex colors
    // A more robust implementation would handle different color formats
    const validHex = color.replace('#', '');
    const rgbHex = validHex.length === 3
      ? validHex.split('').map(c => c + c).join('')
      : validHex;
      
    const r = parseInt(rgbHex.substring(0, 2), 16);
    const g = parseInt(rgbHex.substring(2, 4), 16);
    const b = parseInt(rgbHex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // Generate a shadow style for components
  getShadowStyle: (elevation: number, color?: string): object => {
    // This is a simplified version for the hackathon
    return {
      shadowColor: color || '#000',
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: elevation,
      elevation,
    };
  },
};