import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './card';
import { IconSymbol } from './icon-symbol';

interface ContributionCardProps {
  title: string;
  repository: string;
  type: 'pull_request' | 'issue' | 'commit';
  status: 'merged' | 'open' | 'closed';
  date: string;
  additions?: number;
  deletions?: number;
  onPress?: () => void;
}

export function ContributionCard({
  title,
  repository,
  type,
  status,
  date,
  additions = 0,
  deletions = 0,
  onPress,
}: ContributionCardProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'merged':
        return theme.colors.accent;
      case 'open':
        return theme.colors.success;
      case 'closed':
        return theme.colors.error;
      default:
        return theme.colors.secondaryText;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'pull_request':
        return 'arrow.triangle.pull';
      case 'issue':
        return 'exclamationmark.circle';
      case 'commit':
        return 'dot.radiowaves.left.and.right';
      default:
        return 'circle';
    }
  };

  return (
    <Card>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <IconSymbol 
              name={getTypeIcon()} 
              size={16} 
              color={getStatusColor()} 
            />
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          </View>
          <Text style={[styles.date, { color: theme.colors.secondaryText }]}>
            {date}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {title}
        </Text>
        
        <Text style={[styles.repository, { color: theme.colors.secondaryText }]}>
          {repository}
        </Text>
        
        {(additions > 0 || deletions > 0) && (
          <View style={styles.changesContainer}>
            {additions > 0 && (
              <View style={styles.changeItem}>
                <Text style={[styles.changeText, { color: theme.colors.success }]}>
                  +{additions}
                </Text>
              </View>
            )}
            {deletions > 0 && (
              <View style={styles.changeItem}>
                <Text style={[styles.changeText, { color: theme.colors.error }]}>
                  -{deletions}
                </Text>
              </View>
            )}
          </View>
        )}
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
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  date: {
    ...Typography.caption1,
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  repository: {
    ...Typography.subheadline,
    marginBottom: Spacing.sm,
  },
  changesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  changeItem: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    ...Typography.caption1,
    fontWeight: '600',
  },
});