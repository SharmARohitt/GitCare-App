import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProjectDetailView } from '@/components/ui/project-detail-view';
import { ProjectItem } from '@/components/ui/project-item';
import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Mock data
  const projects = [
    {
      name: 'react-native',
      description: 'A framework for building native applications using React',
      language: 'JavaScript',
      stars: 118000,
      forks: 24200,
      contributions: 23,
      lastContribution: '2 days ago',
      owner: 'facebook',
      avatar: 'https://github.com/facebook.png',
      contributors: 2641,
      openIssues: 1289,
      license: 'MIT',
      homepage: 'https://reactnative.dev',
      repositoryUrl: 'https://github.com/facebook/react-native',
      contributionHistory: [
        {
          id: 1,
          type: 'commit',
          title: 'Fix text input focus handling on Android',
          description: 'Resolved an issue where keyboard would dismiss unexpectedly when tapping on TextInput components',
          timestamp: 'May 27, 2023',
          additions: 52,
          deletions: 17,
          branch: 'main'
        },
        {
          id: 2,
          type: 'pull_request',
          title: 'Improve ScrollView performance on iOS',
          description: 'Optimized memory usage for large scrollable content',
          timestamp: 'May 18, 2023',
          status: 'merged',
          prNumber: 1234,
          additions: 127,
          deletions: 89
        },
        {
          id: 3,
          type: 'issue',
          title: 'FlatList renders incorrectly on Android 13',
          description: 'When using FlatList with horizontal={true}, items are clipped on certain Android devices',
          timestamp: 'April 30, 2023',
          status: 'closed',
          issueNumber: 4567
        },
        {
          id: 4,
          type: 'code_review',
          title: 'Review PR #1432: New Animations API',
          timestamp: 'April 15, 2023'
        },
        {
          id: 5,
          type: 'commit',
          title: 'Update documentation for new component APIs',
          timestamp: 'March 22, 2023',
          additions: 342,
          deletions: 108,
          branch: 'docs-update'
        }
      ]
    },
    {
      name: 'expo',
      description: 'An open-source platform for making universal native apps with React',
      language: 'TypeScript',
      stars: 32100,
      forks: 5200,
      contributions: 15,
      lastContribution: '1 week ago',
      owner: 'expo',
      avatar: 'https://github.com/expo.png',
      contributors: 453,
      openIssues: 341,
      license: 'MIT',
      homepage: 'https://expo.dev',
      repositoryUrl: 'https://github.com/expo/expo',
      contributionHistory: [
        {
          id: 1,
          type: 'pull_request',
          title: 'Add support for new camera features',
          description: 'Implemented access to additional camera controls on iOS and Android',
          timestamp: 'June 12, 2023',
          status: 'merged',
          prNumber: 789,
          additions: 234,
          deletions: 56
        },
        {
          id: 2,
          type: 'commit',
          title: 'Fix File System documentation typos',
          timestamp: 'June 02, 2023',
          additions: 12,
          deletions: 8,
          branch: 'main'
        },
        {
          id: 3,
          type: 'code_review',
          title: 'Review PR #903: Updates to Location module',
          timestamp: 'May 28, 2023'
        }
      ]
    },
    {
      name: 'vscode',
      description: 'Visual Studio Code - Open Source IDE',
      language: 'TypeScript',
      stars: 163000,
      forks: 28900,
      contributions: 8,
      lastContribution: '3 weeks ago',
      owner: 'microsoft',
      avatar: 'https://github.com/microsoft.png',
      contributors: 1543,
      openIssues: 6432,
      license: 'MIT',
      homepage: 'https://code.visualstudio.com',
      repositoryUrl: 'https://github.com/microsoft/vscode',
      contributionHistory: [
        {
          id: 1,
          type: 'issue',
          title: 'Terminal colors not respected in dark theme',
          description: 'When using custom dark themes, terminal colors are not being applied correctly',
          timestamp: 'July 05, 2023',
          status: 'open',
          issueNumber: 12345
        },
        {
          id: 2,
          type: 'pull_request',
          title: 'Add keyboard shortcut for "Go to Implementation"',
          timestamp: 'June 20, 2023',
          status: 'open',
          prNumber: 5678,
          additions: 56,
          deletions: 12
        }
      ]
    },
    {
      name: 'flutter',
      description: 'Flutter makes it easy to build beautiful apps for mobile and beyond',
      language: 'Dart',
      stars: 165000,
      forks: 27300,
      contributions: 5,
      lastContribution: '1 month ago',
      owner: 'flutter',
      avatar: 'https://github.com/flutter.png',
      contributors: 876,
      openIssues: 10234,
      license: 'BSD-3-Clause',
      homepage: 'https://flutter.dev',
      repositoryUrl: 'https://github.com/flutter/flutter',
      contributionHistory: [
        {
          id: 1,
          type: 'commit',
          title: 'Fix ListView scrolling performance on web',
          timestamp: 'May 15, 2023',
          additions: 83,
          deletions: 35,
          branch: 'main'
        },
        {
          id: 2,
          type: 'code_review',
          title: 'Review PR #8901: Material 3 Button improvements',
          timestamp: 'May 02, 2023'
        }
      ]
    },
    {
      name: 'tensorflow',
      description: 'An Open Source Machine Learning Framework for Everyone',
      language: 'Python',
      stars: 185000,
      forks: 74100,
      contributions: 12,
      lastContribution: '2 weeks ago',
      owner: 'tensorflow',
      avatar: 'https://github.com/tensorflow.png',
      contributors: 3245,
      openIssues: 2876,
      license: 'Apache-2.0',
      homepage: 'https://www.tensorflow.org',
      repositoryUrl: 'https://github.com/tensorflow/tensorflow',
      contributionHistory: [
        {
          id: 1,
          type: 'pull_request',
          title: 'Improve GPU memory handling for large models',
          description: 'Optimized memory allocation for transformer-based models',
          timestamp: 'June 28, 2023',
          status: 'merged',
          prNumber: 4532,
          additions: 476,
          deletions: 189
        },
        {
          id: 2,
          type: 'commit',
          title: 'Update documentation for tf.data API',
          timestamp: 'June 14, 2023',
          additions: 235,
          deletions: 97,
          branch: 'main'
        },
        {
          id: 3,
          type: 'issue',
          title: 'Memory leak when using custom training loops',
          description: 'Gradual memory increase observed when running multiple epochs with custom training loops',
          timestamp: 'May 30, 2023',
          status: 'closed',
          issueNumber: 7891
        }
      ]
    },
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
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

      <View style={[styles.header, { padding: responsiveSpacing.md }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, {
              color: theme.colors.text,
              fontSize: responsiveFonts.largeTitle,
            }]}>
              My Projects
            </Text>
            <Text style={[styles.subtitle, {
              color: theme.colors.secondaryText,
              fontSize: responsiveFonts.subheadline,
            }]}>
              {projects.length} repositories you've contributed to
            </Text>
          </View>
          <View style={styles.headerActions}>
            {/* Future: Add search or filter actions */}
          </View>
        </View>
      </View>

      <Animated.View
        style={[styles.searchContainer, { paddingHorizontal: responsiveSpacing.md }]}
        entering={FadeInDown.delay(200).springify()}
      >
        <LinearGradient
          colors={theme.colors.gradient.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.searchInputContainer, {
            borderColor: theme.colors.border,
          }]}
        >
          <IconSymbol name="magnifyingglass" size={20} color={theme.colors.secondaryText} />
          <TextInput
            style={[styles.searchInput, {
              color: theme.colors.text,
              fontSize: responsiveFonts.body,
            }]}
            placeholder="Search projects..."
            placeholderTextColor={theme.colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          padding: responsiveSpacing.md,
          paddingBottom: responsiveSpacing.xxl + 80, // Account for tab bar
        }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.projectsContainer, { gap: responsiveSpacing.md }]}>
          {filteredProjects.map((project, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <ProjectItem
                name={project.name}
                description={project.description}
                language={project.language}
                stars={project.stars}
                forks={project.forks}
                contributions={project.contributions}
                lastContribution={project.lastContribution}
                onPress={() => setSelectedProject(project)}
              />
            </Animated.View>
          ))}
        </View>

        {filteredProjects.length === 0 && (
          <Animated.View
            style={styles.emptyState}
            entering={FadeInDown.delay(400).springify()}
          >
            <IconSymbol name="folder" size={48} color={theme.colors.secondaryText} />
            <Text style={[styles.emptyTitle, {
              color: theme.colors.text,
              fontSize: responsiveFonts.title3,
            }]}>
              No projects found
            </Text>
            <Text style={[styles.emptySubtitle, {
              color: theme.colors.secondaryText,
              fontSize: responsiveFonts.body,
            }]}>
              Try adjusting your search terms
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Project Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={!!selectedProject}
        onRequestClose={() => setSelectedProject(null)}
        statusBarTranslucent
      >
        {selectedProject && (
          <ProjectDetailView
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </Modal>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    width: 40, // Maintain layout balance
  },
  title: {
    ...Typography.largeTitle,
    fontWeight: '800',
    marginBottom: responsiveSpacing.xs,
  },
  subtitle: {
    ...Typography.subheadline,
  },
  searchContainer: {
    paddingBottom: responsiveSpacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: responsiveSpacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  projectsContainer: {},
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
