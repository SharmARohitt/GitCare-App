import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'card';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  type = 'default',
  ...otherProps 
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const getBackgroundColor = () => {
    if (lightColor && darkColor) {
      return colorScheme === 'dark' ? darkColor : lightColor;
    }
    
    switch (type) {
      case 'card':
        return colors.cardBackground;
      default:
        return colors.background;
    }
  };

  return <View style={[{ backgroundColor: getBackgroundColor() }, style]} {...otherProps} />;
}
