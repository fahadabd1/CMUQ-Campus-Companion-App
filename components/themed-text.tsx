import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography, Fonts, Colors } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption' | 'link' |
         // Legacy support for backward compatibility
         'default' | 'title' | 'defaultSemiBold' | 'subtitle';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Map legacy types to new typography system from DESIGN.md
  const normalizedType = type === 'default' ? 'body'
    : type === 'title' ? 'h1'
    : type === 'defaultSemiBold' ? 'body'
    : type === 'subtitle' ? 'h2'
    : type;

  return (
    <Text
      style={[
        { color, fontFamily: Fonts?.primary || 'System' },
        normalizedType === 'h1' ? styles.h1 : undefined,
        normalizedType === 'h2' ? styles.h2 : undefined,
        normalizedType === 'h3' ? styles.h3 : undefined,
        normalizedType === 'body' ? styles.body : undefined,
        normalizedType === 'small' ? styles.small : undefined,
        normalizedType === 'caption' ? styles.caption : undefined,
        normalizedType === 'link' ? styles.link : undefined,
        type === 'defaultSemiBold' ? { fontWeight: '600' } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // DESIGN.md Typography System
  h1: {
    fontSize: Typography.h1.fontSize,       // 24px
    lineHeight: Typography.h1.lineHeight,   // 28.8px (1.2)
    fontWeight: Typography.h1.fontWeight,   // 700 (bold)
  },
  h2: {
    fontSize: Typography.h2.fontSize,       // 20px
    lineHeight: Typography.h2.lineHeight,   // 24px (1.2)
    fontWeight: Typography.h2.fontWeight,   // 600 (semibold)
  },
  h3: {
    fontSize: Typography.h3.fontSize,       // 18px
    lineHeight: Typography.h3.lineHeight,   // 21.6px (1.2)
    fontWeight: Typography.h3.fontWeight,   // 500 (medium)
  },
  body: {
    fontSize: Typography.body.fontSize,     // 16px
    lineHeight: Typography.body.lineHeight, // 24px (1.5)
    fontWeight: Typography.body.fontWeight, // 400 (regular)
  },
  small: {
    fontSize: Typography.small.fontSize,     // 14px
    lineHeight: Typography.small.lineHeight, // 19.6px (1.4)
    fontWeight: Typography.small.fontWeight, // 400 (regular)
  },
  caption: {
    fontSize: Typography.caption.fontSize,     // 12px
    lineHeight: Typography.caption.lineHeight, // 16.8px (1.4)
    fontWeight: Typography.caption.fontWeight, // 300 (light)
  },
  link: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.primary,  // DESIGN.md: Indigo primary color
    textDecorationLine: 'underline',
  },
});
