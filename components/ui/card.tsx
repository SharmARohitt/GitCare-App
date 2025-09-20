import { BorderRadius, Responsive, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
  pressable?: boolean;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);

export function Card({ 
  children, 
  style, 
  animated = true, 
  delay = 0, 
  pressable = false,
  onPress 
}: CardProps) {
  const { theme } = useTheme();
  
  const scaleValue = useSharedValue(1);
  const pressValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressValue.value, [0, 1], [1, 0.98]);
    return {
      transform: [{ scale: scaleValue.value * scale }],
    };
  });

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.cardBackground,
      padding: responsiveSpacing.md,
      ...Shadows.medium,
    },
    style,
  ];

  const handlePressIn = () => {
    if (pressable) {
      pressValue.value = withSpring(1, { damping: 20, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      pressValue.value = withSpring(0, { damping: 20, stiffness: 400 });
    }
  };

  const CardContent = ({ children: cardChildren }: { children: React.ReactNode }) => (
    <Animated.View style={[cardStyle, pressable && animatedStyle]}>
      {cardChildren}
    </Animated.View>
  );

  if (animated) {
    const AnimatedCardContent = ({ children: cardChildren }: { children: React.ReactNode }) => (
      <Animated.View 
        entering={FadeInUp.delay(delay).springify()} 
        style={[cardStyle, pressable && animatedStyle]}
      >
        {cardChildren}
      </Animated.View>
    );

    if (pressable && onPress) {
      return (
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <AnimatedCardContent>{children}</AnimatedCardContent>
        </Pressable>
      );
    }

    return <AnimatedCardContent>{children}</AnimatedCardContent>;
  }

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <CardContent>{children}</CardContent>
      </Pressable>
    );
  }

  return <CardContent>{children}</CardContent>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
  },
});