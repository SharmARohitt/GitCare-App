import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './card';
import { IconSymbol } from './icon-symbol';

interface OpportunityCardProps {
  title: string;
  repository: string;
  bounty?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  description: string;
  timeEstimate: string;
  applicants: number;
  onPress?: () => void;
  onClaim?: () => void;
}

export function OpportunityCard({
  title,
  repository,
  bounty,
  difficulty,
  tags,
  description,
  timeEstimate,
  applicants,
  onPress,
  onClaim,
}: OpportunityCardProps) {
  const { theme } = useTheme();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner':
        return theme.colors.success;
      case 'intermediate':
        return theme.colors.warning;
      case 'advanced':
        return theme.colors.error;
      default:
        return theme.colors.secondaryText;
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'beginner':
        return 'circle.fill';
      case 'intermediate':
        return 'circle.lefthalf.filled';
      case 'advanced':
        return 'circle.fill';
      default:
        return 'circle';
    }
  };

  return (
    <Card>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
              {title}
            </Text>
            {bounty && (
              <View style={[styles.bountyContainer, { backgroundColor: theme.colors.success + '20' }]}>
                <IconSymbol name="dollarsign.circle.fill" size={16} color={theme.colors.success} />
                <Text style={[styles.bountyText, { color: theme.colors.success }]}>
                  ${bounty}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <Text style={[styles.repository, { color: theme.colors.secondaryText }]}>
          {repository}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.secondaryText }]} numberOfLines={3}>
          {description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.tint + '15' }]}>
              <Text style={[styles.tagText, { color: theme.colors.tint }]}>
                {tag}
              </Text>
            </View>
          ))}
          {tags.length > 3 && (
            <Text style={[styles.moreTagsText, { color: theme.colors.secondaryText }]}>
              +{tags.length - 3} more
            </Text>
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <IconSymbol 
                name={getDifficultyIcon()} 
                size={14} 
                color={getDifficultyColor()} 
              />
              <Text style={[styles.metaText, { color: theme.colors.secondaryText }]}>
                {difficulty}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="clock" size={14} color={theme.colors.secondaryText} />
              <Text style={[styles.metaText, { color: theme.colors.secondaryText }]}>
                {timeEstimate}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="person.2" size={14} color={theme.colors.secondaryText} />
              <Text style={[styles.metaText, { color: theme.colors.secondaryText }]}>
                {applicants} applied
              </Text>
            </View>
          </View>
          
          <Pressable 
            onPress={onClaim}
            style={[styles.claimButton, { backgroundColor: theme.colors.tint }]}
          >
            <Text style={styles.claimButtonText}>
              Claim
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.headline,
    flex: 1,
  },
  bountyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  bountyText: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  repository: {
    ...Typography.subheadline,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    ...Typography.caption1,
    fontWeight: '500',
  },
  moreTagsText: {
    ...Typography.caption1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    ...Typography.caption1,
  },
  claimButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  claimButtonText: {
    ...Typography.subheadline,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});