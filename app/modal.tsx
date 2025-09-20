import { Button, Card } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <IconSymbol name="info.circle.fill" size={48} color={colors.tint} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to GitCare
          </Text>
          
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            Track your open-source contributions, discover new opportunities, and showcase your developer journey.
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <IconSymbol name="chart.bar.fill" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Track contributions
              </Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="star.fill" size={20} color={colors.warning} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Find opportunities
              </Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="person.crop.circle.fill" size={20} color={colors.accent} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Build your profile
              </Text>
            </View>
          </View>
          
          <Link href="/" asChild>
            <Button
              title="Get Started"
              onPress={() => {}}
              icon="arrow.right"
              iconPosition="right"
              style={styles.button}
            />
          </Link>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    alignSelf: 'stretch',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    ...Typography.body,
  },
  button: {
    alignSelf: 'stretch',
  },
});
