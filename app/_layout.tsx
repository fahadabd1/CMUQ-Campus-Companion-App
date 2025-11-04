import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/src/database/database';
import { Colors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom theme based on DESIGN.md specifications
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,       // DESIGN.md: Indigo (#3F51B5)
    background: Colors.light.background, // DESIGN.md: White
    card: Colors.light.surface,          // DESIGN.md: Gray-50
    text: Colors.light.text,             // DESIGN.md: Gray-900
    border: Colors.light.border,         // DESIGN.md: Gray-200
    notification: Colors.light.accent,   // DESIGN.md: Amber
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,       // DESIGN.md: Indigo
    background: Colors.dark.background, // DESIGN.md: #1A1A1A
    card: Colors.dark.surface,          // DESIGN.md: #2D2D2D
    text: Colors.dark.text,             // DESIGN.md: Gray-100
    border: Colors.dark.border,         // DESIGN.md: Gray-700
    notification: Colors.dark.accent,   // DESIGN.md: Amber
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize database on app start
    initDatabase();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : LightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="map" options={{ headerShown: false, title: 'Campus Map' }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false, title: 'Privacy Policy' }} />
        <Stack.Screen name="terms-of-service" options={{ headerShown: false, title: 'Terms of Service' }} />
        <Stack.Screen name="help-faq" options={{ headerShown: false, title: 'Help & FAQ' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
