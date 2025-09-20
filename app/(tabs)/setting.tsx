import { IconSymbol } from '@/components/ui/icon-symbol';
import { OpportunityCard } from '@/components/ui/opportunity-card';
import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

type FilterType = 'all' | 'bounty' | 'beginner' | 'intermediate' | 'advanced';

export default function OpportunitiesScreen() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'list.bullet' },
    { key: 'bounty', label: 'Bounty', icon: 'dollarsign.circle' },
    { key: 'beginner', label: 'Beginner', icon: 'circle' },
    { key: 'intermediate', label: 'Intermediate', icon: 'circle.lefthalf.filled' },
    { key: 'advanced', label: 'Advanced', icon: 'circle.fill' },
  ];

  // Mock data
  const opportunities = [
    {
      title: 'Implement dark mode for settings panel',
      repository: 'facebook/react-native',
      bounty: 500,
      difficulty: 'intermediate' as const,
      tags: ['UI/UX', 'React Native', 'Dark Mode'],
      description: 'Add comprehensive dark mode support to the settings panel with proper theme switching and persistence.',
      timeEstimate: '2-3 days',
      applicants: 12,
    },
    {
      title: 'Fix memory leak in image caching',
      repository: 'expo/expo',
      bounty: 750,
      difficulty: 'advanced' as const,
      tags: ['Performance', 'Memory Management', 'Images'],
      description: 'Investigate and fix memory leaks occurring in the image caching system that affects long-running applications.',
      timeEstimate: '3-5 days',
      applicants: 8,
    },
    {
      title: 'Add TypeScript support for new API',
      repository: 'microsoft/vscode',
      difficulty: 'beginner' as const,
      tags: ['TypeScript', 'API', 'Documentation'],
      description: 'Create TypeScript definitions for the new extension API and update documentation with examples.',
      timeEstimate: '1-2 days',
      applicants: 25,
    },
    {
      title: 'Optimize bundle size for web builds',
      repository: 'vercel/next.js',
      bounty: 300,
      difficulty: 'intermediate' as const,
      tags: ['Performance', 'Webpack', 'Bundle Size'],
      description: 'Reduce bundle size for web builds by implementing better tree shaking and code splitting strategies.',
      timeEstimate: '2-4 days',
      applicants: 15,
    },
    {
      title: 'Create accessibility improvements',
      repository: 'flutter/flutter',
      difficulty: 'beginner' as const,
      tags: ['Accessibility', 'A11y', 'Flutter'],
      description: 'Improve accessibility features for screen readers and keyboard navigation in core widgets.',
      timeEstimate: '1-3 days',
      applicants: 18,
    },
  ];

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bounty') return opportunity.bounty !== undefined;
    return opportunity.difficulty === activeFilter;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={theme.colors.gradient.secondary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View 
        style={[styles.header, { padding: responsiveSpacing.md }]}
        entering={FadeInDown.delay(100).springify()}
      >
        <Text style={[styles.title, { 
          color: theme.colors.text,
          fontSize: responsiveFonts.largeTitle,
        }]}>
          Opportunities
        </Text>
        <Text style={[styles.subtitle, { 
          color: theme.colors.secondaryText,
          fontSize: responsiveFonts.subheadline,
        }]}>
          {opportunities.length} open bounties and issues
        </Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <Pressable
            key={filter.key}
            onPress={() => setActiveFilter(filter.key)}
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === filter.key
                  ? theme.colors.tint
                  : theme.colors.cardBackground,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <IconSymbol
              name={filter.icon as any}
              size={16}
              color={activeFilter === filter.key ? '#FFFFFF' : theme.colors.secondaryText}
            />
            <Text style={[
              styles.filterText,
              {
                color: activeFilter === filter.key ? '#FFFFFF' : theme.colors.text,
              }
            ]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.opportunitiesContainer}>
          {filteredOpportunities.map((opportunity, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(300 + index * 100).springify()}
            >
              <OpportunityCard
                title={opportunity.title}
                repository={opportunity.repository}
                bounty={opportunity.bounty}
                difficulty={opportunity.difficulty}
                tags={opportunity.tags}
                description={opportunity.description}
                timeEstimate={opportunity.timeEstimate}
                applicants={opportunity.applicants}
                onPress={() => console.log('Opportunity pressed:', opportunity.title)}
                onClaim={() => console.log('Claim pressed:', opportunity.title)}
              />
            </Animated.View>
          ))}
        </View>

        {filteredOpportunities.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="star" size={48} color={theme.colors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No opportunities found
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.secondaryText }]}>
              Try changing your filter or check back later
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: responsiveSpacing.sm,
  },
  title: {
    ...Typography.largeTitle,
    fontWeight: '800',
    marginBottom: responsiveSpacing.xs,
  },
  subtitle: {
    ...Typography.subheadline,
  },
  filtersContainer: {
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: responsiveSpacing.md,
    paddingBottom: responsiveSpacing.md,
    gap: responsiveSpacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: responsiveSpacing.xs,
  },
  filterText: {
    ...Typography.subheadline,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: responsiveSpacing.md,
    paddingTop: 0,
    paddingBottom: responsiveSpacing.xxl + 80,
  },
  opportunitiesContainer: {
    gap: responsiveSpacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing.xxl,
    gap: responsiveSpacing.md,
  },
  emptyTitle: {
    ...Typography.title3,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
  },
});
