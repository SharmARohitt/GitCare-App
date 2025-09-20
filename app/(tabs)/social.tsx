import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function SocialScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'developers' | 'trending'>('feed');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Mock data
  const feedItems = [
    {
      id: 1,
      user: { name: 'Sarah Chen', username: '@sarahdev', avatar: '👩‍💻' },
      action: 'merged a pull request',
      project: 'react-native-ui-kit',
      description: 'Added dark mode support for all components',
      time: '2 hours ago',
      stats: { likes: 24, comments: 8, shares: 3 },
    },
    {
      id: 2,
      user: { name: 'Alex Rodriguez', username: '@alexcodes', avatar: '👨‍💻' },
      action: 'created a new repository',
      project: 'awesome-animations',
      description: 'A collection of smooth React Native animations',
      time: '4 hours ago',
      stats: { likes: 45, comments: 12, shares: 8 },
    },
    {
      id: 3,
      user: { name: 'Maya Patel', username: '@mayabuilds', avatar: '👩‍🔬' },
      action: 'earned a badge',
      project: 'Open Source Hero',
      description: 'Contributed to 50+ repositories this year',
      time: '6 hours ago',
      stats: { likes: 67, comments: 15, shares: 12 },
    },
  ];

  const trendingDevelopers = [
    { name: 'John Doe', username: '@johndoe', contributions: 234, avatar: '👨‍💼' },
    { name: 'Emma Wilson', username: '@emmaw', contributions: 189, avatar: '👩‍🎨' },
    { name: 'David Kim', username: '@davidk', contributions: 156, avatar: '👨‍🔬' },
    { name: 'Lisa Zhang', username: '@lisaz', contributions: 142, avatar: '👩‍💼' },
  ];

  const renderTabButton = (tab: typeof activeTab, title: string, icon: string) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? theme.colors.tint : 'transparent',
        }
      ]}
    >
      <IconSymbol 
        name={icon as any} 
        size={16} 
        color={activeTab === tab ? '#FFFFFF' : theme.colors.secondaryText} 
      />
      <Text style={[
        styles.tabButtonText,
        {
          color: activeTab === tab ? '#FFFFFF' : theme.colors.secondaryText,
        }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderFeedItem = (item: typeof feedItems[0], index: number) => (
    <Animated.View
      key={item.id}
      entering={FadeInUp.delay(index * 100).springify()}
    >
      <Card style={{ marginBottom: responsiveSpacing.md }}>
        <View style={styles.feedHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.avatar}>{item.user.avatar}</Text>
            <View>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {item.user.name}
              </Text>
              <Text style={[styles.userAction, { color: theme.colors.secondaryText }]}>
                {item.action} in {item.project}
              </Text>
            </View>
          </View>
          <Text style={[styles.time, { color: theme.colors.secondaryText }]}>
            {item.time}
          </Text>
        </View>
        
        <Text style={[styles.feedDescription, { color: theme.colors.text }]}>
          {item.description}
        </Text>
        
        <View style={styles.feedActions}>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="heart" size={16} color={theme.colors.secondaryText} />
            <Text style={[styles.actionText, { color: theme.colors.secondaryText }]}>
              {item.stats.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="message" size={16} color={theme.colors.secondaryText} />
            <Text style={[styles.actionText, { color: theme.colors.secondaryText }]}>
              {item.stats.comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="square.and.arrow.up" size={16} color={theme.colors.secondaryText} />
            <Text style={[styles.actionText, { color: theme.colors.secondaryText }]}>
              {item.stats.shares}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );

  const renderDeveloper = (developer: typeof trendingDevelopers[0], index: number) => (
    <Animated.View
      key={developer.username}
      entering={FadeInLeft.delay(index * 100).springify()}
    >
      <Card style={{ marginBottom: responsiveSpacing.sm }}>
        <View style={styles.developerItem}>
          <View style={styles.developerInfo}>
            <Text style={styles.developerAvatar}>{developer.avatar}</Text>
            <View>
              <Text style={[styles.developerName, { color: theme.colors.text }]}>
                {developer.name}
              </Text>
              <Text style={[styles.developerUsername, { color: theme.colors.secondaryText }]}>
                {developer.username}
              </Text>
            </View>
          </View>
          <View style={styles.developerStats}>
            <Text style={[styles.contributionCount, { color: theme.colors.tint }]}>
              {developer.contributions}
            </Text>
            <Text style={[styles.contributionLabel, { color: theme.colors.secondaryText }]}>
              contributions
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

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
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { 
          padding: responsiveSpacing.md,
          paddingBottom: responsiveSpacing.xxl + 80,
        }]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.tint}
            colors={[theme.colors.tint]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(100).springify()}
        >
          <Text style={[styles.title, { 
            color: theme.colors.text,
            fontSize: responsiveFonts.largeTitle,
          }]}>
            Developer Community
          </Text>
          <Text style={[styles.subtitle, { 
            color: theme.colors.secondaryText,
            fontSize: responsiveFonts.subheadline,
          }]}>
            Connect with fellow developers and share your journey
          </Text>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View 
          style={styles.tabContainer}
          entering={FadeInDown.delay(200).springify()}
        >
          {renderTabButton('feed', 'Activity', 'list.bullet')}
          {renderTabButton('developers', 'Developers', 'person.2')}
          {renderTabButton('trending', 'Trending', 'chart.line.uptrend.xyaxis')}
        </Animated.View>

        {/* Content based on active tab */}
        {activeTab === 'feed' && (
          <View style={styles.content}>
            {feedItems.map(renderFeedItem)}
          </View>
        )}

        {activeTab === 'developers' && (
          <View style={styles.content}>
            <Animated.View entering={FadeInUp.delay(300).springify()}>
              <Text style={[styles.sectionTitle, { 
                color: theme.colors.text,
                marginBottom: responsiveSpacing.md,
              }]}>
                Top Contributors This Week
              </Text>
            </Animated.View>
            {trendingDevelopers.map(renderDeveloper)}
          </View>
        )}

        {activeTab === 'trending' && (
          <View style={styles.content}>
            <Animated.View entering={FadeInUp.delay(300).springify()}>
              <Card style={{ marginBottom: responsiveSpacing.md }}>
                <View style={styles.trendingHeader}>
                  <IconSymbol name="flame.fill" size={24} color={theme.colors.warning} />
                  <Text style={[styles.trendingTitle, { color: theme.colors.text }]}>
                    Trending Projects
                  </Text>
                </View>
                <Text style={[styles.trendingDescription, { color: theme.colors.secondaryText }]}>
                  Discover the hottest open-source projects gaining momentum in the developer community.
                </Text>
                <Button
                  title="Explore Trending"
                  onPress={() => {}}
                  variant="gradient"
                  icon="arrow.right"
                  iconPosition="right"
                  style={{ marginTop: responsiveSpacing.md }}
                />
              </Card>
            </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  header: {
    marginBottom: responsiveSpacing.lg,
  },
  title: {
    ...Typography.largeTitle,
    fontWeight: '800',
    marginBottom: responsiveSpacing.xs,
  },
  subtitle: {
    ...Typography.subheadline,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: responsiveSpacing.lg,
    gap: responsiveSpacing.sm,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
    gap: responsiveSpacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  tabButtonText: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.title2,
    fontWeight: '700',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveSpacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    flex: 1,
  },
  avatar: {
    fontSize: 32,
  },
  userName: {
    ...Typography.headline,
    fontWeight: '600',
  },
  userAction: {
    ...Typography.subheadline,
  },
  time: {
    ...Typography.caption1,
  },
  feedDescription: {
    ...Typography.body,
    marginBottom: responsiveSpacing.md,
  },
  feedActions: {
    flexDirection: 'row',
    gap: responsiveSpacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  actionText: {
    ...Typography.subheadline,
  },
  developerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    flex: 1,
  },
  developerAvatar: {
    fontSize: 28,
  },
  developerName: {
    ...Typography.headline,
    fontWeight: '600',
  },
  developerUsername: {
    ...Typography.subheadline,
  },
  developerStats: {
    alignItems: 'flex-end',
  },
  contributionCount: {
    ...Typography.title3,
    fontWeight: '700',
  },
  contributionLabel: {
    ...Typography.caption2,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    marginBottom: responsiveSpacing.sm,
  },
  trendingTitle: {
    ...Typography.title2,
    fontWeight: '700',
  },
  trendingDescription: {
    ...Typography.body,
    lineHeight: 22,
  },
});