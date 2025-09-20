import { BorderRadius, Responsive, Shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor, 
  trend 
}: StatsCardProps) {
  const { theme } = useTheme();
  
  const scaleValue = useSharedValue(1);
  const iconScale = useSharedValue(1);

  React.useEffect(() => {
    // Animate icon on mount
    iconScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 15, stiffness: 300 }),
        withSpring(1, { damping: 20, stiffness: 400 })
      )
    );
  }, [iconScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const cardWidth = screenWidth < 375 ? (screenWidth - 48) / 2 : (screenWidth - 48) / 2;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: cardWidth }}
    >
      <Animated.View 
        style={[animatedStyle]}
        entering={FadeInUp.springify()}
      >
        <LinearGradient
          colors={theme.colors.gradient.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.container, {
            minHeight: screenWidth < 375 ? 110 : 120,
            padding: responsiveSpacing.md,
            ...Shadows.medium,
          }]}
        >
          <View style={styles.header}>
            <Animated.View style={iconAnimatedStyle}>
              <View style={[styles.iconContainer, { backgroundColor: (iconColor || theme.colors.tint) + '20' }]}>
                <IconSymbol 
                  name={icon as any} 
                  size={screenWidth < 375 ? 20 : 24} 
                  color={iconColor || theme.colors.tint} 
                />
              </View>
            </Animated.View>
            {trend && (
              <View style={[styles.trendContainer, { 
                backgroundColor: trend.isPositive ? theme.colors.success + '20' : theme.colors.error + '20' 
              }]}>
                <IconSymbol 
                  name={trend.isPositive ? 'arrow.up' : 'arrow.down'} 
                  size={10} 
                  color={trend.isPositive ? theme.colors.success : theme.colors.error} 
                />
                <Text style={[
                  styles.trendText, 
                  { 
                    color: trend.isPositive ? theme.colors.success : theme.colors.error,
                    fontSize: responsiveFonts.caption2,
                  }
                ]}>
                  {Math.abs(trend.value)}%
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.value, { 
            color: theme.colors.text,
            fontSize: responsiveFonts.title1,
          }]}>
            {value}
          </Text>
          
          <Text style={[styles.title, { 
            color: theme.colors.text,
            fontSize: responsiveFonts.subheadline,
          }]}>
            {title}
          </Text>
          
          {subtitle && (
            <Text style={[styles.subtitle, { 
              color: theme.colors.secondaryText,
              fontSize: responsiveFonts.caption1,
            }]}>
              {subtitle}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveSpacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
    paddingHorizontal: responsiveSpacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontWeight: '600',
  },
  value: {
    fontWeight: '800',
    marginBottom: responsiveSpacing.xs,
  },
  title: {
    fontWeight: '600',
    marginBottom: responsiveSpacing.xs,
  },
  subtitle: {
    fontWeight: '500',
  },
});