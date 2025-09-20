import { ContributionCard } from '@/components/ui/contribution-card';
import { GradientCard } from '@/components/ui/gradient-card';
import { StatsCard } from '@/components/ui/stats-card';
import { Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { 
    isConnected, 
    balance, 
    reputationScore, 
    userBounties, 
    assignedBounties,
    refreshData 
  } = useBlockchain();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Stats data with blockchain integration
  const stats = [
    {
      title: 'Wallet Balance',
      value: isConnected ? `${parseFloat(balance).toFixed(3)} ETH` : 'Not Connected',
      subtitle: 'Available funds',
      icon: 'wallet.pass.fill',
      iconColor: theme.colors.success,
    },
    {
      title: 'Reputation',
      value: isConnected ? reputationScore.toString() : '0',
      subtitle: 'Developer score',
      icon: 'star.fill',
      iconColor: theme.colors.warning,
    },
    {
      title: 'Created Bounties',
      value: userBounties.length.toString(),
      subtitle: 'Total issued',
      icon: 'plus.circle.fill',
      iconColor: theme.colors.tint,
    },
    {
      title: 'Assigned Bounties',
      value: assignedBounties.length.toString(),
      subtitle: 'Working on',
      icon: 'checkmark.circle.fill',
      iconColor: theme.colors.accent,
    },
  ];

  const recentContributions = [
    {
      title: 'Fix memory leak in image processing',
      repository: 'facebook/react-native',
      type: 'pull_request' as const,
      status: 'merged' as const,
      date: '2 hours ago',
      additions: 45,
      deletions: 12,
    },
    {
      title: 'Add dark mode support for navigation',
      repository: 'expo/expo',
      type: 'pull_request' as const,
      status: 'open' as const,
      date: '1 day ago',
      additions: 128,
      deletions: 34,
    },
    {
      title: 'Performance optimization for large lists',
      repository: 'microsoft/vscode',
      type: 'issue' as const,
      status: 'open' as const,
      date: '3 days ago',
    },
  ];

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
        contentContainerStyle={[styles.scrollContent, { padding: responsiveSpacing.md }]}
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
          <View style={styles.headerTop}>
            <View>
              
              <Text style={[styles.title, {
                color: theme.colors.text,
                fontSize: responsiveFonts.largeTitle,
              }]}>
                Hello, Om! 👋
              </Text>
            </View>
            <View style={styles.headerActions}>
              {/* Future: Add notification bell or other actions */}
            </View>
          </View>
        </Animated.View>

        {/* Hero Stats Card */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <GradientCard
            gradientType="primary"
            style={{ ...styles.heroCard, marginBottom: responsiveSpacing.lg }}
            delay={0}
          >
            <Text style={[styles.heroTitle, { fontSize: responsiveFonts.title2 }]}>
              Weekly Summary
            </Text>
            <Text style={[styles.heroValue, { fontSize: responsiveFonts.largeTitle }]}>
              47 Contributions
            </Text>
            <Text style={styles.heroSubtitle}>
              +12% from last week
            </Text>
          </GradientCard>
        </Animated.View>

        <View style={[styles.statsGrid, { gap: responsiveSpacing.md }]}>
          {stats.map((stat, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(300 + index * 100).springify()}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={[styles.section, { marginBottom: responsiveSpacing.xl }]}
          entering={FadeInUp.delay(700).springify()}
        >
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: responsiveFonts.title2,
            marginBottom: responsiveSpacing.md,
          }]}>
            Recent Contributions
          </Text>

          <View style={[styles.contributionsContainer, { gap: responsiveSpacing.md }]}>
            {recentContributions.map((contribution, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(800 + index * 100).springify()}
              >
                <ContributionCard
                  title={contribution.title}
                  repository={contribution.repository}
                  type={contribution.type}
                  status={contribution.status}
                  date={contribution.date}
                  additions={contribution.additions}
                  deletions={contribution.deletions}
                  onPress={() => console.log('Contribution pressed:', contribution.title)}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: responsiveSpacing.xxl,
  },
  header: {
    marginBottom: responsiveSpacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    width: 40, // Maintain layout balance
  },
  greeting: {
    ...Typography.subheadline,
    marginBottom: responsiveSpacing.xs,
  },
  title: {
    ...Typography.largeTitle,
    fontWeight: '800',
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: responsiveSpacing.xl,
  },
  heroTitle: {
    ...Typography.title2,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: responsiveSpacing.sm,
  },
  heroValue: {
    ...Typography.largeTitle,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: responsiveSpacing.xs,
  },
  heroSubtitle: {
    ...Typography.subheadline,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsiveSpacing.xl,
  },
  section: {},
  sectionTitle: {
    ...Typography.title2,
    fontWeight: '700',
  },
  contributionsContainer: {},
});
