import { Animations } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface ThemeToggleProps {
  size?: number;
}

export function ThemeToggle({ size = 40 }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  
  const animatedValue = useSharedValue(isDark ? 1 : 0);
  const scaleValue = useSharedValue(1);
  const rotationValue = useSharedValue(0);

  React.useEffect(() => {
    animatedValue.value = withSpring(isDark ? 1 : 0, Animations.spring.gentle);
  }, [isDark, animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleValue.value },
        { rotate: `${rotationValue.value}deg` }
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const rotation = animatedValue.value * 360;
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const handlePress = () => {
    scaleValue.value = withSequence(
      withSpring(0.8, { damping: 20, stiffness: 400 }),
      withSpring(1, { damping: 20, stiffness: 400 })
    );
    
    rotationValue.value = withSequence(
      withSpring(15, { damping: 20, stiffness: 400 }),
      withSpring(0, { damping: 20, stiffness: 400 })
    );
    
    toggleTheme();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={isDark ? ['#1E293B', '#0F172A'] : ['#3B82F6', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.container,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Animated.View style={iconAnimatedStyle}>
            <IconSymbol
              name={isDark ? 'moon.fill' : 'sun.max.fill'}
              size={size * 0.5}
              color="#FFFFFF"
            />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});