import { Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'body' | 'callout' | 'subheadline' | 'footnote' | 'caption1' | 'caption2';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();
  
  const getColor = () => {
    if (lightColor && darkColor) {
      return theme.dark ? darkColor : lightColor;
    }
    return type === 'link' ? theme.colors.tint : theme.colors.text;
  };

  const getTextStyle = () => {
    switch (type) {
      case 'largeTitle':
        return Typography.largeTitle;
      case 'title1':
        return Typography.title1;
      case 'title2':
        return Typography.title2;
      case 'title3':
        return Typography.title3;
      case 'headline':
        return Typography.headline;
      case 'body':
        return Typography.body;
      case 'callout':
        return Typography.callout;
      case 'subheadline':
        return Typography.subheadline;
      case 'footnote':
        return Typography.footnote;
      case 'caption1':
        return Typography.caption1;
      case 'caption2':
        return Typography.caption2;
      case 'title':
        return styles.title;
      case 'defaultSemiBold':
        return styles.defaultSemiBold;
      case 'subtitle':
        return styles.subtitle;
      case 'link':
        return styles.link;
      default:
        return styles.default;
    }
  };

  return (
    <Text
      style={[
        { color: getColor() },
        getTextStyle(),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
