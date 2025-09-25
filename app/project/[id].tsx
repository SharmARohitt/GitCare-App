import { ProjectDetailView } from '@/components/ui/project-detail-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // In a real app, we would fetch the project data using the ID
    // For this example, we'll use mock data
    // Simulate API call delay
    const timer = setTimeout(() => {
      // This is just an example project - in a real app, you'd fetch this from your API
      setProject({
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
          }
        ]
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading project...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text>Project not found</Text>
      </View>
    );
  }

  return <ProjectDetailView project={project} onClose={() => {}} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});