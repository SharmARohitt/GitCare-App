import { BorderRadius, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { LoadingSpinner } from './loading-spinner';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const { spacing, fonts } = useResponsive();
  
  const scaleValue = useSharedValue(1);
  const rotationValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { rotate: `${rotationValue.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 20, stiffness: 400 });
    
    // Add a subtle rotation animation on press
    rotationValue.value = withSequence(
      withSpring(2, { damping: 20, stiffness: 400 }),
      withSpring(0, { damping: 20, stiffness: 400 })
    );
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: BorderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: spacing.sm,
      ...Shadows.medium,
    };

    const sizeStyles = {
      small: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
      medium: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
      large: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
    };

    return [baseStyle, sizeStyles[size]];
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.secondaryText;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'gradient':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return theme.colors.tint;
      default:
        return theme.colors.text;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 18;
      case 'large':
        return 20;
      default:
        return 18;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner size={getIconSize()} color={getTextColor()} />;
    }

    const textElement = (
      <Text 
        key="text"
        style={[
          {
            fontSize: fonts.subheadline,
            color: getTextColor(),
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );

    if (!icon) return textElement;

    const iconElement = (
      <IconSymbol 
        key="icon"
        name={icon as any} 
        size={getIconSize()} 
        color={getTextColor()} 
      />
    );

    return iconPosition === 'left' 
      ? [iconElement, textElement]
      : [textElement, iconElement];
  };

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={disabled ? [theme.colors.border, theme.colors.border] as const : theme.colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getButtonStyle()}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.border : theme.colors.tint,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.border : theme.colors.accent,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.border : theme.colors.tint,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        ...getButtonStyle(),
        variantStyles[variant as keyof typeof variantStyles],
        animatedStyle,
        style,
      ]}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}