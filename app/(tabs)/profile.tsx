import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BorderRadius, Responsive } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'John Developer',
    username: '@johndeveloper',
    email: 'john.dev@example.com',
    bio: 'Full-stack developer passionate about open source and mobile development. Building the future one commit at a time.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    joinDate: 'Dec 2023',
    location: 'San Francisco, CA',
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserProfile(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // Mock data
  const profileStats = [
    {
      title: 'Contributions',
      value: '1,247',
      subtitle: 'This year',
      icon: 'chart.bar.fill',
      trend: { value: 15, isPositive: true },
    },
    {
      title: 'Repositories',
      value: '23',
      subtitle: 'Active',
      icon: 'folder.fill',
      iconColor: theme.colors.accent,
    },
    {
      title: 'Followers',
      value: '892',
      subtitle: 'GitHub',
      icon: 'person.2.fill',
      iconColor: theme.colors.success,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Stars Earned',
      value: '2.1K',
      subtitle: 'Total',
      icon: 'star.fill',
      iconColor: theme.colors.warning,
    },
  ];

  const badges = [
    { name: 'Early Adopter', icon: 'star.fill', color: theme.colors.warning },
    { name: 'Bug Hunter', icon: 'ladybug.fill', color: theme.colors.error },
    { name: 'Code Reviewer', icon: 'eye.fill', color: theme.colors.tint },
    { name: 'Open Source Hero', icon: 'heart.fill', color: theme.colors.accent },
    { name: 'Top Contributor', icon: 'trophy.fill', color: theme.colors.success },
    { name: 'Mentor', icon: 'person.2.fill', color: theme.colors.accent },
  ];

  const skills = [
    'React Native', 'TypeScript', 'JavaScript', 'Swift', 'Kotlin',
    'Node.js', 'Python', 'Git', 'CI/CD', 'Testing', 'GraphQL', 'AWS'
  ];

  const achievements = [
    { title: '100 Day Streak', description: 'Contributed for 100 consecutive days', date: '2 days ago' },
    { title: 'First PR Merged', description: 'Your first pull request was merged', date: '1 week ago' },
    { title: 'Community Helper', description: 'Helped 50+ developers in discussions', date: '2 weeks ago' },
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
        {/* Profile Header with Gradient */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHeaderGradient}
          >
            <View style={styles.profileHeaderTop}>
              <ThemeToggle size={36} />
              <TouchableOpacity style={styles.editProfileButton}>
                <IconSymbol name="pencil" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileContent}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                <Image source={{ uri: userProfile.image }} style={styles.avatar} />
                <View style={styles.avatarEditIcon}>
                  <IconSymbol name="camera.fill" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileUsername}>{userProfile.username}</Text>
              
              <View style={styles.profileDetails}>
                <View style={styles.detailItem}>
                  <IconSymbol name="envelope" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.detailText}>{userProfile.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <IconSymbol name="location" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.detailText}>{userProfile.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <IconSymbol name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.detailText}>Joined {userProfile.joinDate}</Text>
                </View>
              </View>
              
              <Text style={styles.profileBio}>{userProfile.bio}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats Row */}
        <Animated.View 
          style={[styles.quickStatsContainer, { marginVertical: responsiveSpacing.lg }]}
          entering={FadeInUp.delay(200).springify()}
        >
          <LinearGradient
            colors={theme.colors.gradient.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickStatsCard}
          >
            <View style={styles.quickStatsGrid}>
              {profileStats.slice(0, 3).map((stat, index) => (
                <View key={index} style={styles.quickStatItem}>
                  <View style={[styles.quickStatIcon, { backgroundColor: (stat.iconColor || theme.colors.tint) + '20' }]}>
                    <IconSymbol 
                      name={stat.icon as any} 
                      size={18} 
                      color={stat.iconColor || theme.colors.tint} 
                    />
                  </View>
                  <Text style={[styles.quickStatValue, { color: theme.colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.quickStatLabel, { color: theme.colors.secondaryText }]}>{stat.title}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Reputation & Badges */}
        <Animated.View entering={FadeInLeft.delay(300).springify()}>
          <Card style={{ marginBottom: responsiveSpacing.md }}>
            <View style={styles.sectionHeader}>
              <View style={styles.reputationHeader}>
                <IconSymbol name="star.fill" size={20} color={theme.colors.warning} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Reputation Score
                </Text>
              </View>
              <View style={styles.reputationScore}>
                <Text style={[styles.reputationValue, { color: theme.colors.tint }]}>4.8</Text>
                <Text style={[styles.reputationMax, { color: theme.colors.secondaryText }]}>/5.0</Text>
              </View>
            </View>
            
            <View style={styles.reputationBreakdown}>
              <View style={styles.reputationItem}>
                <Text style={[styles.reputationLabel, { color: theme.colors.secondaryText }]}>Code Quality</Text>
                <View style={styles.reputationBar}>
                  <View style={[styles.reputationFill, { width: '90%', backgroundColor: theme.colors.success }]} />
                </View>
              </View>
              <View style={styles.reputationItem}>
                <Text style={[styles.reputationLabel, { color: theme.colors.secondaryText }]}>Communication</Text>
                <View style={styles.reputationBar}>
                  <View style={[styles.reputationFill, { width: '85%', backgroundColor: theme.colors.tint }]} />
                </View>
              </View>
              <View style={styles.reputationItem}>
                <Text style={[styles.reputationLabel, { color: theme.colors.secondaryText }]}>Reliability</Text>
                <View style={styles.reputationBar}>
                  <View style={[styles.reputationFill, { width: '95%', backgroundColor: theme.colors.accent }]} />
                </View>
              </View>
            </View>

            <View style={styles.badgesPreview}>
              <Text style={[styles.badgesTitle, { color: theme.colors.text }]}>Recent Achievements</Text>
              <View style={styles.badgesRow}>
                {badges.slice(0, 4).map((badge, index) => (
                  <View key={index} style={[styles.badgeMini, { backgroundColor: badge.color + '20' }]}>
                    <IconSymbol name={badge.icon as any} size={16} color={badge.color} />
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Skills Section */}
        <Animated.View entering={FadeInRight.delay(800).springify()}>
          <Card style={{ marginBottom: responsiveSpacing.md }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Skills & Technologies
              </Text>
              <TouchableOpacity>
                <IconSymbol name="plus" size={20} color={theme.colors.tint} />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInUp.delay(900 + index * 30).springify()}
                >
                  <LinearGradient
                    colors={[theme.colors.tint + '15', theme.colors.tint + '05']}
                    style={styles.skillTag}
                  >
                    <Text style={[styles.skillText, { color: theme.colors.tint }]}>
                      {skill}
                    </Text>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInUp.delay(1000).springify()}>
          <Card style={{ marginBottom: responsiveSpacing.md }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Preferences
              </Text>
            </View>
            
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.tint + '20' }]}>
                    <IconSymbol name={theme.dark ? 'moon.fill' : 'sun.max.fill'} size={18} color={theme.colors.tint} />
                  </View>
                  <View>
                    <Text style={[styles.settingText, { color: theme.colors.text }]}>
                      Dark Mode
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.secondaryText }]}>
                      Switch between light and dark themes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={theme.dark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.border, true: theme.colors.tint }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.warning + '20' }]}>
                    <IconSymbol name="bell.fill" size={18} color={theme.colors.warning} />
                  </View>
                  <View>
                    <Text style={[styles.settingText, { color: theme.colors.text }]}>
                      Push Notifications
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.secondaryText }]}>
                      Get notified about new opportunities
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.tint }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(1100).springify()}>
          <View style={styles.actionButtons}>
            <Button
              title="Edit Profile"
              onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
              variant="gradient"
              icon="pencil"
              style={{ flex: 1 }}
            />
            <Button
              title="Share Profile"
              onPress={() => Alert.alert('Share Profile', 'Profile sharing coming soon!')}
              variant="outline"
              icon="square.and.arrow.up"
              style={{ flex: 1 }}
            />
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
    paddingBottom: responsiveSpacing.xxl + 80,
  },
  profileHeaderGradient: {
    borderRadius: BorderRadius.xl,
    padding: responsiveSpacing.lg,
    marginBottom: responsiveSpacing.md,
  },
  profileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing.lg,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: responsiveSpacing.sm,
    borderRadius: 20,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: responsiveSpacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 6,
  },
  profileName: {
    fontSize: responsiveFonts.title1,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: responsiveSpacing.xs,
  },
  profileUsername: {
    fontSize: responsiveFonts.subheadline,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: responsiveSpacing.md,
  },
  profileDetails: {
    gap: responsiveSpacing.sm,
    marginBottom: responsiveSpacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
  },
  detailText: {
    fontSize: responsiveFonts.subheadline,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  profileBio: {
    fontSize: responsiveFonts.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  quickStatsContainer: {
    marginHorizontal: responsiveSpacing.md,
  },
  quickStatsCard: {
    padding: responsiveSpacing.lg,
    borderRadius: BorderRadius.xl,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatValue: {
    fontSize: responsiveFonts.title3,
    fontWeight: '800',
  },
  quickStatLabel: {
    fontSize: responsiveFonts.caption1,
    fontWeight: '500',
  },
  reputationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
  },
  reputationScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  reputationValue: {
    fontSize: responsiveFonts.title2,
    fontWeight: '800',
  },
  reputationMax: {
    fontSize: responsiveFonts.subheadline,
  },
  reputationBreakdown: {
    gap: responsiveSpacing.sm,
    marginVertical: responsiveSpacing.md,
  },
  reputationItem: {
    gap: responsiveSpacing.xs,
  },
  reputationLabel: {
    fontSize: responsiveFonts.subheadline,
    fontWeight: '500',
  },
  reputationBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  reputationFill: {
    height: '100%',
    borderRadius: 3,
  },
  badgesPreview: {
    paddingTop: responsiveSpacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  badgesTitle: {
    fontSize: responsiveFonts.subheadline,
    fontWeight: '600',
    marginBottom: responsiveSpacing.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: responsiveSpacing.sm,
  },
  badgeMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing.md,
  },
  sectionTitle: {
    fontSize: responsiveFonts.title3,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: responsiveFonts.subheadline,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveSpacing.md,
  },
  badge: {
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    width: '30%',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: responsiveFonts.caption1,
    textAlign: 'center',
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveSpacing.sm,
  },
  skillTag: {
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderRadius: BorderRadius.md,
  },
  skillText: {
    fontSize: responsiveFonts.subheadline,
    fontWeight: '600',
  },
  settingsContainer: {
    gap: responsiveSpacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSpacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.md,
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: responsiveFonts.body,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: responsiveFonts.caption1,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: responsiveSpacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: responsiveSpacing.md,
    marginTop: responsiveSpacing.md,
  },
});
