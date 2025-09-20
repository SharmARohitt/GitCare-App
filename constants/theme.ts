/**
 * Black and Navy Blue theme for the open-source contribution tracking app
 */

import { Platform } from 'react-native';

const tintColorLight = '#1E3A8A'; // Navy Blue
const tintColorDark = '#3B82F6'; // Lighter Blue

export const Colors = {
  light: {
    text: '#1F2937',
    secondaryText: '#6B7280',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    accent: '#8B5CF6',
    gradient: {
      primary: ['#1E3A8A', '#3B82F6'] as const,
      secondary: ['#F8FAFC', '#E5E7EB'] as const,
      card: ['#FFFFFF', '#F8FAFC'] as const,
      accent: ['#8B5CF6', '#A855F7'] as const,
    },
  },
  dark: {
    text: '#F9FAFB',
    secondaryText: '#D1D5DB',
    background: '#0F172A',
    cardBackground: '#1E293B',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    accent: '#A855F7',
    gradient: {
      primary: ['#1E3A8A', '#3B82F6'] as const,
      secondary: ['#0F172A', '#1E293B'] as const,
      card: ['#1E293B', '#334155'] as const,
      accent: ['#8B5CF6', '#A855F7'] as const,
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Responsive = {
  // Screen breakpoints
  breakpoints: {
    small: 375,   // iPhone SE
    medium: 390,  // iPhone 12/13/14
    large: 428,   // iPhone 14 Pro Max
    tablet: 768,  // iPad
  },
  
  // Responsive spacing
  getSpacing: (screenWidth: number) => ({
    xs: screenWidth < 375 ? 3 : 4,
    sm: screenWidth < 375 ? 6 : 8,
    md: screenWidth < 375 ? 12 : 16,
    lg: screenWidth < 375 ? 18 : 24,
    xl: screenWidth < 375 ? 24 : 32,
    xxl: screenWidth < 375 ? 36 : 48,
  }),
  
  // Responsive font sizes
  getFontSizes: (screenWidth: number) => {
    const scale = screenWidth < 375 ? 0.9 : screenWidth > 428 ? 1.1 : 1;
    return {
      largeTitle: Math.round(34 * scale),
      title1: Math.round(28 * scale),
      title2: Math.round(22 * scale),
      title3: Math.round(20 * scale),
      headline: Math.round(17 * scale),
      body: Math.round(17 * scale),
      callout: Math.round(16 * scale),
      subheadline: Math.round(15 * scale),
      footnote: Math.round(13 * scale),
      caption1: Math.round(12 * scale),
      caption2: Math.round(11 * scale),
    };
  },
};

export const Animations = {
  // Timing configurations
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Spring configurations
  spring: {
    gentle: {
      damping: 20,
      stiffness: 300,
    },
    bouncy: {
      damping: 15,
      stiffness: 400,
    },
    snappy: {
      damping: 25,
      stiffness: 500,
    },
  },
  
  // Easing curves
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};