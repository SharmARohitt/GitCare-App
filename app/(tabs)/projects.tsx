import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProjectItem } from '@/components/ui/project-item';
import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

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
    },
    {
      name: 'expo',
      description: 'An open-source platform for making universal native apps with React',
      language: 'TypeScript',
      stars: 32100,
      forks: 5200,
      contributions: 15,
      lastContribution: '1 week ago',
    },
    {
      name: 'vscode',
      description: 'Visual Studio Code - Open Source IDE',
      language: 'TypeScript',
      stars: 163000,
      forks: 28900,
      contributions: 8,
      lastContribution: '3 weeks ago',
    },
    {
      name: 'flutter',
      description: 'Flutter makes it easy to build beautiful apps for mobile and beyond',
      language: 'Dart',
      stars: 165000,
      forks: 27300,
      contributions: 5,
      lastContribution: '1 month ago',
    },
    {
      name: 'tensorflow',
      description: 'An Open Source Machine Learning Framework for Everyone',
      language: 'Python',
      stars: 185000,
      forks: 74100,
      contributions: 12,
      lastContribution: '2 weeks ago',
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
                onPress={() => console.log('Project pressed:', project.name)}
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
