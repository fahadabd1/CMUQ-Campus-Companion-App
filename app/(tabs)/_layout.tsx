import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors, Components, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        // DESIGN.md: Primary color (#3F51B5) for active, Gray-600 for inactive
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // DESIGN.md: Bottom Navigation Bar - 60px height, white background, top border
        tabBarStyle: {
          height: Components.bottomNav.height,
          paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
          paddingTop: Spacing.sm,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          // Shadow: 0 -2px 10px rgba(0,0,0,0.1)
          elevation: 8, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        // DESIGN.md: 10px font size for labels
        tabBarLabelStyle: {
          fontSize: Components.bottomNav.labelSize,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // DESIGN.md: Icons 24px × 24px
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: Components.bottomNav.iconSize }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: Components.bottomNav.iconSize }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="lostfound"
        options={{
          title: 'Lost & Found',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: Components.bottomNav.iconSize }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Others',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: Components.bottomNav.iconSize }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
