/**
 * CMUQ Campus Companion App - Design System
 * Based on DESIGN.md specifications
 */

import { Platform } from 'react-native';

// Primary Colors
export const PrimaryColors = {
  primary: '#3F51B5',        // Indigo
  primaryHover: '#303F9F',   // Indigo Dark
  accent: '#FFC107',         // Amber
  accentHover: '#FFA000',    // Amber Dark
};

// Status Colors
export const StatusColors = {
  success: '#10B981',   // Green
  error: '#EF4444',     // Red
  warning: '#F59E0B',   // Amber
  info: '#3B82F6',      // Blue
};

// Room States (for map)
export const RoomStates = {
  available: '#10B981',  // Green
  occupied: '#EF4444',   // Red
  selected: '#3B82F6',   // Blue
};

export const Colors = {
  light: {
    // Primary
    primary: PrimaryColors.primary,
    primaryHover: PrimaryColors.primaryHover,
    accent: PrimaryColors.accent,
    accentHover: PrimaryColors.accentHover,

    // Neutral Colors
    background: '#FFFFFF',
    surface: '#F9FAFB',           // Gray-50
    text: '#111827',              // Gray-900
    textSecondary: '#4B5563',     // Gray-600
    border: '#E5E7EB',            // Gray-200

    // Legacy support for existing code
    tint: PrimaryColors.primary,
    icon: '#4B5563',
    tabIconDefault: '#4B5563',
    tabIconSelected: PrimaryColors.primary,

    // Status
    success: StatusColors.success,
    error: StatusColors.error,
    warning: StatusColors.warning,
    info: StatusColors.info,
  },
  dark: {
    // Primary
    primary: PrimaryColors.primary,
    primaryHover: PrimaryColors.primaryHover,
    accent: PrimaryColors.accent,
    accentHover: PrimaryColors.accentHover,

    // Neutral Colors - Dark Mode
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#F3F4F6',              // Gray-100
    textSecondary: '#9CA3AF',     // Gray-400
    border: '#374151',            // Gray-700

    // Legacy support for existing code
    tint: PrimaryColors.primary,
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: PrimaryColors.primary,

    // Status
    success: StatusColors.success,
    error: StatusColors.error,
    warning: StatusColors.warning,
    info: StatusColors.info,
  },
};

// Spacing System (Base unit: 4px)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// Container Padding
export const Container = {
  paddingMobile: 16,
  safeAreaTop: 48,
  bottomNavClearance: 80,
  maxWidth: 448, // max-w-md for mobile-first approach
};

// Touch Targets
export const TouchTargets = {
  minimum: 44,
  recommended: 48,
  bottomNavIcon: 60,
};

// Typography
export const Typography = {
  h1: {
    fontSize: 24,
    lineHeight: 24 * 1.2,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 20,
    lineHeight: 20 * 1.2,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 18 * 1.2,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontWeight: '300' as const,
  },
};

// Font Family Configuration
export const Fonts = Platform.select({
  ios: {
    /** iOS uses San Francisco as alternative to Roboto */
    primary: 'System',
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    /** Android uses Roboto as primary font */
    primary: 'Roboto',
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    primary: 'System',
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    primary: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Component Sizes
export const Components = {
  // Navigation
  bottomNav: {
    height: 60,
    iconSize: 24,
    labelSize: 10,
    shadow: '0 -2px 10px rgba(0,0,0,0.1)',
  },

  // Cards
  card: {
    padding: 16,
    borderRadius: 8,
    gap: 16,
    shadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  // Buttons
  button: {
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  // Input Fields
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16, // Prevents zoom on iOS
  },

  // Modals
  modal: {
    borderRadius: 12,
    padding: 20,
    maxHeight: '90vh' as any,
  },

  // Map
  map: {
    previewHeight: 200,
    borderRadius: 8,
  },
};
