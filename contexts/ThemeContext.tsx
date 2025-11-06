import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import db from '../src/database/database';

type ColorScheme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  // Load theme preference from database on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update color scheme when system theme or preference changes
  useEffect(() => {
    if (themePreference === 'system') {
      setColorScheme(systemColorScheme === 'dark' ? 'dark' : 'light');
    } else {
      setColorScheme(themePreference);
    }
  }, [themePreference, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const result = db.getFirstSync<{ value: string }>(
        'SELECT value FROM preferences WHERE key = ?',
        ['theme_preference']
      );
      if (result) {
        setThemePreferenceState(result.value as ThemePreference);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemePreference = async (preference: ThemePreference) => {
    try {
      // Save to database
      db.runSync(
        'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)',
        ['theme_preference', preference]
      );
      // Update state
      setThemePreferenceState(preference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const isDark = colorScheme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themePreference,
        setThemePreference,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
