import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './card';
import { IconSymbol } from './icon-symbol';

interface ProjectItemProps {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  contributions: number;
  lastContribution: string;
  onPress?: () => void;
}

export function ProjectItem({
  name,
  description,
  language,
  stars,
  forks,
  contributions,
  lastContribution,
  onPress,
}: ProjectItemProps) {
  const { theme } = useTheme();

  const getLanguageColor = (lang: string) => {
    const languageColors: { [key: string]: string } = {
      JavaScript: '#F7DF1E',
      TypeScript: '#3178C6',
      Python: '#3776AB',
      Java: '#ED8B00',
      Swift: '#FA7343',
      Kotlin: '#7F52FF',
      Go: '#00ADD8',
      Rust: '#000000',
      'C++': '#00599C',
      Ruby: '#CC342D',
    };
    return languageColors[lang] || theme.colors.accent;
  };

  return (
    <Card>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <IconSymbol name="folder.fill" size={20} color={theme.colors.accent} />
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={styles.contributionsContainer}>
            <Text style={[styles.contributionsCount, { color: theme.colors.tint }]}>
              {contributions}
            </Text>
            <Text style={[styles.contributionsLabel, { color: theme.colors.secondaryText }]}>
              contributions
            </Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: theme.colors.secondaryText }]} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.languageContainer}>
            <View style={[styles.languageDot, { backgroundColor: getLanguageColor(language) }]} />
            <Text style={[styles.language, { color: theme.colors.text }]}>
              {language}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={14} color={theme.colors.warning} />
              <Text style={[styles.statText, { color: theme.colors.secondaryText }]}>
                {stars}
              </Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="arrow.triangle.branch" size={14} color={theme.colors.secondaryText} />
              <Text style={[styles.statText, { color: theme.colors.secondaryText }]}>
                {forks}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.lastContribution, { color: theme.colors.secondaryText }]}>
          Last contribution: {lastContribution}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  name: {
    ...Typography.headline,
    flex: 1,
  },
  contributionsContainer: {
    alignItems: 'flex-end',
  },
  contributionsCount: {
    ...Typography.title3,
    fontWeight: '700',
  },
  contributionsLabel: {
    ...Typography.caption2,
  },
  description: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  languageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  language: {
    ...Typography.subheadline,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.subheadline,
  },
  lastContribution: {
    ...Typography.caption1,
  },
});