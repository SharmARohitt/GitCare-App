import { Responsive } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

interface ResponsiveValues {
  screenWidth: number;
  screenHeight: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  spacing: ReturnType<typeof Responsive.getSpacing>;
  fonts: ReturnType<typeof Responsive.getFontSizes>;
}

export function useResponsive(): ResponsiveValues {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;

  return {
    screenWidth,
    screenHeight,
    isSmallScreen: screenWidth < Responsive.breakpoints.small,
    isMediumScreen: screenWidth >= Responsive.breakpoints.small && screenWidth < Responsive.breakpoints.large,
    isLargeScreen: screenWidth >= Responsive.breakpoints.large,
    spacing: Responsive.getSpacing(screenWidth),
    fonts: Responsive.getFontSizes(screenWidth),
  };
}