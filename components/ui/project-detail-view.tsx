import { BorderRadius, Responsive, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Animated as RNAnimated, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from './card';
import { IconSymbol } from './icon-symbol';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

interface Contribution {
  id: number;
  type: 'commit' | 'pull_request' | 'issue' | 'code_review';
  title: string;
  description?: string;
  timestamp: string;
  status?: 'open' | 'merged' | 'closed';
  additions?: number;
  deletions?: number;
  link?: string;
  branch?: string;
  prNumber?: number;
  issueNumber?: number;
}

interface ProjectDetailViewProps {
  project: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    contributions: number;
    lastContribution: string;
    // Additional details for the project view
    owner: string;
    avatar?: string;
    contributors?: number;
    openIssues?: number;
    license?: string;
    homepage?: string;
    repositoryUrl: string;
    contributionHistory: Contribution[];
  };
  onClose: () => void;
}

export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'contributions' | 'issues' | 'details'>('contributions');
  const scrollY = React.useRef(new RNAnimated.Value(0)).current;

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
      Dart: '#0175C2',
    };
    return languageColors[lang] || theme.colors.accent;
  };

  const getContributionIcon = (type: Contribution['type']) => {
    switch (type) {
      case 'commit':
        return 'arrow.triangle.turn.up.right.circle.fill';
      case 'pull_request':
        return 'arrow.triangle.pull';
      case 'issue':
        return 'exclamationmark.circle.fill';
      case 'code_review':
        return 'text.magnifyingglass';
      default:
        return 'circle.fill';
    }
  };

  const getContributionColor = (type: Contribution['type'], status?: string) => {
    if (status === 'merged') return theme.colors.tint;
    if (status === 'closed') return theme.colors.error;
    
    switch (type) {
      case 'commit':
        return theme.colors.success;
      case 'pull_request':
        return status === 'open' ? theme.colors.warning : theme.colors.tint;
      case 'issue':
        return status === 'open' ? theme.colors.error : theme.colors.success;
      case 'code_review':
        return theme.colors.accent;
      default:
        return theme.colors.text;
    }
  };

  const getContributionTypeLabel = (type: Contribution['type']) => {
    switch (type) {
      case 'commit':
        return 'Commit';
      case 'pull_request':
        return 'Pull Request';
      case 'issue':
        return 'Issue';
      case 'code_review':
        return 'Code Review';
      default:
        return 'Contribution';
    }
  };

  // Group contributions by month
  const contributionsByMonth: { [key: string]: Contribution[] } = {};
  project.contributionHistory.forEach(contribution => {
    const date = new Date(contribution.timestamp);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!contributionsByMonth[monthYear]) {
      contributionsByMonth[monthYear] = [];
    }
    contributionsByMonth[monthYear].push(contribution);
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const renderContribution = ({ item, index }: { item: Contribution; index: number }) => (
    <Animated.View 
      entering={SlideInRight.delay(index * 50).springify()}
      style={styles.contributionItem}
    >
      <View style={[styles.contributionIconContainer, {
        backgroundColor: getContributionColor(item.type, item.status) + '20'
      }]}>
        <IconSymbol 
          name={getContributionIcon(item.type)} 
          size={20} 
          color={getContributionColor(item.type, item.status)}
        />
      </View>
      <View style={styles.contributionContent}>
        <View style={styles.contributionHeader}>
          <Text style={[styles.contributionType, { color: theme.colors.secondaryText }]}>
            {getContributionTypeLabel(item.type)} 
            {item.prNumber ? ` #${item.prNumber}` : ''}
            {item.issueNumber ? ` #${item.issueNumber}` : ''}
          </Text>
          <Text style={[styles.contributionDate, { color: theme.colors.secondaryText }]}>
            {item.timestamp}
          </Text>
        </View>
        <Text style={[styles.contributionTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={[styles.contributionDescription, { color: theme.colors.secondaryText }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {(item.additions !== undefined || item.deletions !== undefined) && (
          <View style={styles.codeChanges}>
            {item.additions !== undefined && (
              <View style={styles.codeChangeItem}>
                <Text style={[styles.additionsText, { color: theme.colors.success }]}>+{item.additions}</Text>
              </View>
            )}
            {item.deletions !== undefined && (
              <View style={styles.codeChangeItem}>
                <Text style={[styles.deletionsText, { color: theme.colors.error }]}>-{item.deletions}</Text>
              </View>
            )}
          </View>
        )}
        {item.status && (
          <View style={[styles.statusContainer, { 
            backgroundColor: getContributionColor(item.type, item.status) + '20' 
          }]}>
            <Text style={[styles.statusText, { 
              color: getContributionColor(item.type, item.status) 
            }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <RNAnimated.View style={[
        styles.floatingHeader, 
        { 
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          opacity: headerOpacity,
        }
      ]}>
        <TouchableOpacity 
          style={[styles.closeButton, { marginLeft: -4 }]}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="chevron.left" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {project.name}
        </Text>
        <View style={{ width: 44 }} />
      </RNAnimated.View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ marginTop: 8, marginBottom: 12 }}>
          <TouchableOpacity 
            style={[styles.closeButton, { marginLeft: -4 }]} 
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="chevron.left" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeIn.delay(100).springify()}>
          <View style={styles.header}>
            <View style={styles.projectTitleContainer}>
              <IconSymbol name="folder.fill" size={24} color={theme.colors.accent} />
              <View>
                <Text style={[styles.projectName, { color: theme.colors.text }]}>
                  {project.name}
                </Text>
                <Text style={[styles.projectOwner, { color: theme.colors.secondaryText }]}>
                  {project.owner}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <IconSymbol name="star.fill" size={16} color={theme.colors.warning} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{project.stars}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <IconSymbol name="arrow.triangle.branch" size={16} color={theme.colors.secondaryText} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{project.forks}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <IconSymbol name="person.2.fill" size={16} color={theme.colors.secondaryText} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {project.contributors || '—'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <IconSymbol name="exclamationmark.circle" size={16} color={theme.colors.error} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {project.openIssues || '—'}
                </Text>
              </View>
            </View>

            <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
              {project.description}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <View style={styles.languageContainer}>
                  <View style={[styles.languageDot, { backgroundColor: getLanguageColor(project.language) }]} />
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {project.language}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.lastContributionContainer}>
                  <IconSymbol name="clock.arrow.circlepath" size={14} color={theme.colors.secondaryText} />
                  <Text style={[styles.detailValue, { color: theme.colors.secondaryText }]}>
                    Last contribution: {project.lastContribution}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contributionSummary}>
              <View style={styles.contributionCount}>
                <Text style={[styles.contributionCountValue, { color: theme.colors.tint }]}>
                  {project.contributions}
                </Text>
                <Text style={[styles.contributionCountLabel, { color: theme.colors.secondaryText }]}>
                  Total Contributions
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.repositoryLink, { backgroundColor: theme.colors.tint }]}
                onPress={() => {}}
              >
                <IconSymbol name="arrow.up.forward.app" size={16} color="#FFFFFF" />
                <Text style={styles.repositoryLinkText}>
                  Open Repository
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'contributions' && [styles.activeTab, { borderBottomColor: theme.colors.tint }]
              ]}
              onPress={() => setActiveTab('contributions')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'contributions' ? theme.colors.tint : theme.colors.secondaryText }
              ]}>
                Contributions
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'issues' && [styles.activeTab, { borderBottomColor: theme.colors.tint }]
              ]}
              onPress={() => setActiveTab('issues')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'issues' ? theme.colors.tint : theme.colors.secondaryText }
              ]}>
                Issues
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'details' && [styles.activeTab, { borderBottomColor: theme.colors.tint }]
              ]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'details' ? theme.colors.tint : theme.colors.secondaryText }
              ]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {activeTab === 'contributions' && (
          <View style={styles.contributionsContainer}>
            {Object.entries(contributionsByMonth).map(([month, contributions], monthIndex) => (
              <Animated.View 
                key={month}
                entering={FadeInDown.delay(300 + monthIndex * 50).springify()}
              >
                <Text style={[styles.monthHeader, { color: theme.colors.text }]}>
                  {month}
                </Text>
                <Card style={styles.timelineCard}>
                  <View style={styles.timelineContainer}>
                    {contributions.map((contribution, index) => (
                      <React.Fragment key={contribution.id}>
                        {renderContribution({ item: contribution, index })}
                        {index < contributions.length - 1 && (
                          <View style={[styles.timelineDivider, { backgroundColor: theme.colors.tabIconDefault }]} />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}

        {activeTab === 'issues' && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.issuesContainer}
          >
            <Card style={styles.emptyCardContainer}>
              <IconSymbol name="exclamationmark.circle" size={40} color={theme.colors.secondaryText} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Open Issues
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.secondaryText }]}>
                You haven't created or been assigned any issues in this repository.
              </Text>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.tint }]}>
                <Text style={styles.actionButtonText}>Browse Issues</Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {activeTab === 'details' && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.detailsContainer}
          >
            <Card style={styles.detailCard}>
              <Text style={[styles.detailCardTitle, { color: theme.colors.text }]}>
                Repository Details
              </Text>
              
              <View style={styles.detailCardRow}>
                <Text style={[styles.detailCardLabel, { color: theme.colors.secondaryText }]}>
                  Full Name
                </Text>
                <Text style={[styles.detailCardValue, { color: theme.colors.text }]}>
                  {project.owner}/{project.name}
                </Text>
              </View>
              
              <View style={styles.detailCardDivider} />
              
              <View style={styles.detailCardRow}>
                <Text style={[styles.detailCardLabel, { color: theme.colors.secondaryText }]}>
                  License
                </Text>
                <Text style={[styles.detailCardValue, { color: theme.colors.text }]}>
                  {project.license || 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.detailCardDivider} />
              
              <View style={styles.detailCardRow}>
                <Text style={[styles.detailCardLabel, { color: theme.colors.secondaryText }]}>
                  Language
                </Text>
                <View style={styles.languageContainer}>
                  <View style={[styles.languageDot, { backgroundColor: getLanguageColor(project.language) }]} />
                  <Text style={[styles.detailCardValue, { color: theme.colors.text }]}>
                    {project.language}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailCardDivider} />
              
              <View style={styles.detailCardRow}>
                <Text style={[styles.detailCardLabel, { color: theme.colors.secondaryText }]}>
                  Homepage
                </Text>
                <Text style={[styles.detailCardValue, { color: theme.colors.tint }]}>
                  {project.homepage || 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.detailCardDivider} />
              
              <View style={styles.detailCardRow}>
                <Text style={[styles.detailCardLabel, { color: theme.colors.secondaryText }]}>
                  Your Contributions
                </Text>
                <Text style={[styles.detailCardValue, { color: theme.colors.text }]}>
                  {project.contributions}
                </Text>
              </View>
            </Card>
            
            <Card style={styles.activityCard}>
              <Text style={[styles.detailCardTitle, { color: theme.colors.text }]}>
                Activity Overview
              </Text>
              
              <View style={styles.activityChartContainer}>
                {/* Chart would go here */}
                <Text style={[styles.chartPlaceholder, { color: theme.colors.secondaryText }]}>
                  Contribution activity graph will be shown here
                </Text>
              </View>
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64, // Increased height
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.md,
    borderBottomWidth: 1,
    paddingTop: 4, // Added padding to move content down slightly
  },
  headerTitle: {
    ...Typography.headline,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: responsiveSpacing.md,
    paddingTop: responsiveSpacing.lg, // Increased top padding to move content down
    paddingBottom: responsiveSpacing.xxl,
  },
  closeButton: {
    width: 44,
    height: 44, // Increased button size
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveSpacing.sm, // Added margin to move it lower
  },
  header: {
    marginBottom: responsiveSpacing.md,
  },
  projectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    marginBottom: responsiveSpacing.md,
  },
  projectName: {
    ...Typography.title1,
    fontWeight: '700',
  },
  projectOwner: {
    ...Typography.subheadline,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  statValue: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  statDivider: {
    height: 20,
    width: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  description: {
    ...Typography.body,
    marginBottom: responsiveSpacing.md,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    ...Typography.subheadline,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  languageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  lastContributionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  contributionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing.lg,
  },
  contributionCount: {
    alignItems: 'flex-start',
  },
  contributionCountValue: {
    ...Typography.largeTitle,
    fontWeight: '700',
  },
  contributionCountLabel: {
    ...Typography.caption1,
  },
  repositoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
  },
  repositoryLinkText: {
    ...Typography.subheadline,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    marginBottom: responsiveSpacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveSpacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  contributionsContainer: {
    gap: responsiveSpacing.md,
  },
  monthHeader: {
    ...Typography.headline,
    fontWeight: '700',
    marginBottom: responsiveSpacing.sm,
    marginTop: responsiveSpacing.md,
  },
  timelineCard: {
    overflow: 'hidden',
  },
  timelineContainer: {
    padding: responsiveSpacing.md,
  },
  timelineDivider: {
    height: 1,
    marginVertical: responsiveSpacing.sm,
  },
  contributionItem: {
    flexDirection: 'row',
    gap: responsiveSpacing.md,
  },
  contributionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contributionContent: {
    flex: 1,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  contributionType: {
    ...Typography.caption1,
  },
  contributionDate: {
    ...Typography.caption1,
  },
  contributionTitle: {
    ...Typography.headline,
    fontWeight: '600',
    marginBottom: 4,
  },
  contributionDescription: {
    ...Typography.body,
    marginBottom: responsiveSpacing.xs,
  },
  codeChanges: {
    flexDirection: 'row',
    gap: responsiveSpacing.sm,
    marginTop: 4,
  },
  codeChangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  additionsText: {
    ...Typography.caption1,
    fontWeight: '600',
  },
  deletionsText: {
    ...Typography.caption1,
    fontWeight: '600',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveSpacing.sm,
    paddingVertical: responsiveSpacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: responsiveSpacing.xs,
  },
  statusText: {
    ...Typography.caption1,
    fontWeight: '600',
  },
  issuesContainer: {
    flex: 1,
  },
  emptyCardContainer: {
    padding: responsiveSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...Typography.title3,
    fontWeight: '600',
    marginTop: responsiveSpacing.md,
    marginBottom: responsiveSpacing.xs,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: responsiveSpacing.lg,
  },
  actionButton: {
    paddingHorizontal: responsiveSpacing.lg,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    ...Typography.subheadline,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsContainer: {
    gap: responsiveSpacing.md,
  },
  detailCard: {
    padding: responsiveSpacing.md,
  },
  detailCardTitle: {
    ...Typography.headline,
    fontWeight: '600',
    marginBottom: responsiveSpacing.md,
  },
  detailCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSpacing.sm,
  },
  detailCardLabel: {
    ...Typography.subheadline,
  },
  detailCardValue: {
    ...Typography.subheadline,
    fontWeight: '500',
  },
  detailCardDivider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  activityCard: {
    padding: responsiveSpacing.md,
  },
  activityChartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    ...Typography.subheadline,
  },
});