import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradientType?: 'primary' | 'secondary' | 'card' | 'accent';
  animated?: boolean;
  delay?: number;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function GradientCard({ 
  children, 
  style, 
  gradientType = 'card',
  animated = true, 
  delay = 0 
}: GradientCardProps) {
  const { theme } = useTheme();

  const gradientColors = theme.colors.gradient[gradientType];

  const cardStyle = [
    {
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      ...Shadows.medium,
    },
    style,
  ];

  if (animated) {
    return (
      <AnimatedLinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyle}
        entering={FadeInUp.delay(delay).springify()}
      >
        {children}
      </AnimatedLinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={cardStyle}
    >
      {children}
    </LinearGradient>
  );
}