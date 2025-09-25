import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert, Image } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

export default function SocialScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'developers' | 'trending'>('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostProject, setNewPostProject] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<typeof trendingDevelopers[0] | null>(null);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState([
    {
      id: 1,
      user: { name: 'Sarah Chen', username: '@sarahdev', avatar: '👩‍💻' },
      action: 'merged a pull request',
      project: 'react-native-ui-kit',
      description: 'Added dark mode support for all components',
      time: '2 hours ago',
      stats: { likes: 24, comments: 8, shares: 3 },
      image: null as string | null,
    },
    {
      id: 2,
      user: { name: 'Alex Rodriguez', username: '@alexcodes', avatar: '👨‍💻' },
      action: 'created a new repository',
      project: 'awesome-animations',
      description: 'A collection of smooth React Native animations',
      time: '4 hours ago',
      stats: { likes: 45, comments: 12, shares: 8 },
      image: null as string | null,
    },
    {
      id: 3,
      user: { name: 'Maya Patel', username: '@mayabuilds', avatar: '👩‍🔬' },
      action: 'earned a badge',
      project: 'Open Source Hero',
      description: 'Contributed to 50+ repositories this year',
      time: '6 hours ago',
      stats: { likes: 67, comments: 15, shares: 12 },
      image: null as string | null,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const trendingDevelopers = [
    { 
      name: 'John Doe', 
      username: '@johndoe', 
      contributions: 234, 
      avatar: '👨‍💼',
      location: 'San Francisco, CA',
      occupation: 'Senior Full Stack Developer',
      company: 'Tech Innovators Inc.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      bio: 'Passionate about building scalable web applications and mentoring junior developers. Open source enthusiast with 5+ years of experience.',
      joinedDate: 'March 2019'
    },
    { 
      name: 'Emma Wilson', 
      username: '@emmaw', 
      contributions: 189, 
      avatar: '👩‍🎨',
      location: 'London, UK',
      occupation: 'UI/UX Designer & Frontend Developer',
      company: 'Design Studio Pro',
      skills: ['Figma', 'React Native', 'CSS', 'JavaScript', 'Design Systems'],
      bio: 'Creating beautiful and intuitive user experiences. Love combining design thinking with clean code.',
      joinedDate: 'July 2020'
    },
    { 
      name: 'David Kim', 
      username: '@davidk', 
      contributions: 156, 
      avatar: '👨‍🔬',
      location: 'Seoul, South Korea',
      occupation: 'Data Scientist & ML Engineer',
      company: 'AI Research Lab',
      skills: ['Python', 'TensorFlow', 'React', 'SQL', 'Machine Learning'],
      bio: 'Building intelligent systems that solve real-world problems. PhD in Computer Science with focus on AI.',
      joinedDate: 'January 2021'
    },
    { 
      name: 'Lisa Zhang', 
      username: '@lisaz', 
      contributions: 142, 
      avatar: '👩‍💼',
      location: 'Toronto, Canada',
      occupation: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python'],
      bio: 'Automating everything and making deployments seamless. Cloud architecture enthusiast.',
      joinedDate: 'September 2020'
    },
  ];

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'Please enter a description for your post');
      return;
    }

    const newPost = {
      id: feedItems.length + 1,
      user: { name: 'You', username: '@yourhandle', avatar: '👤' },
      action: newPostProject.trim() ? `shared update on` : 'posted',
      project: newPostProject.trim() || 'general',
      description: newPostText.trim(),
      time: 'now',
      stats: { likes: 0, comments: 0, shares: 0 },
      image: selectedImage,
    };

    setFeedItems([newPost, ...feedItems]);
    setShowCreateModal(false);
    setNewPostText('');
    setNewPostProject('');
    setSelectedImage(null);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleDeveloperPress = (developer: typeof trendingDevelopers[0]) => {
    setSelectedDeveloper(developer);
    setShowDeveloperModal(true);
  };

  const handleAddFriend = (username: string) => {
    if (!friendRequests.includes(username)) {
      setFriendRequests([...friendRequests, username]);
      Alert.alert('Friend Request Sent', `Your friend request has been sent to ${username.replace('@', '')}`);
    }
  };

  const handleCancelFriendRequest = (username: string) => {
    setFriendRequests(friendRequests.filter(req => req !== username));
    Alert.alert('Friend Request Cancelled', `Friend request to ${username.replace('@', '')} has been cancelled`);
  };

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
                {item.action} {item.project !== 'general' && `in ${item.project}`}
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
        
        {item.image && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}
        
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
      <TouchableOpacity onPress={() => handleDeveloperPress(developer)}>
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
      </TouchableOpacity>
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
            {/* Create Post Button */}
            <Animated.View entering={FadeInUp.delay(300).springify()}>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.colors.tint }]}
                onPress={() => setShowCreateModal(true)}
              >
                <IconSymbol name="plus" size={24} color="#FFFFFF" />
                <Text style={[styles.createButtonText, { color: '#FFFFFF' }]}>
                  Share an update
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
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

      {/* Developer Profile Modal */}
      <Modal
        visible={showDeveloperModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.tabIconDefault }]}>
            <TouchableOpacity onPress={() => setShowDeveloperModal(false)}>
              <IconSymbol name="xmark" size={20} color={theme.colors.secondaryText} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Developer Profile
            </Text>
            <View style={{ width: 20 }} />
          </View>

          {selectedDeveloper && (
            <ScrollView style={styles.modalContent} contentContainerStyle={{ padding: responsiveSpacing.lg }}>
              {/* Profile Header */}
              <Animated.View entering={FadeInUp.delay(100).springify()}>
                <View style={styles.profileHeader}>
                  <Text style={styles.profileAvatar}>{selectedDeveloper.avatar}</Text>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.colors.text }]}>
                      {selectedDeveloper.name}
                    </Text>
                    <Text style={[styles.profileUsername, { color: theme.colors.secondaryText }]}>
                      {selectedDeveloper.username}
                    </Text>
                    <View style={styles.locationContainer}>
                      <IconSymbol name="location" size={14} color={theme.colors.secondaryText} />
                      <Text style={[styles.locationText, { color: theme.colors.secondaryText }]}>
                        {selectedDeveloper.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* Stats */}
              <Animated.View entering={FadeInUp.delay(200).springify()}>
                <Card style={{ marginVertical: responsiveSpacing.md }}>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.colors.tint }]}>
                        {selectedDeveloper.contributions}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                        Contributions
                      </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.colors.tabIconDefault }]} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                        {Math.floor(Math.random() * 50) + 20}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                        Repositories
                      </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.colors.tabIconDefault }]} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
                        {Math.floor(Math.random() * 500) + 100}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                        Followers
                      </Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>

              {/* Bio */}
              <Animated.View entering={FadeInUp.delay(300).springify()}>
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    About
                  </Text>
                  <Text style={[styles.bioText, { color: theme.colors.secondaryText }]}>
                    {selectedDeveloper.bio}
                  </Text>
                </View>
              </Animated.View>

              {/* Work Info */}
              <Animated.View entering={FadeInUp.delay(400).springify()}>
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Work
                  </Text>
                  <View style={styles.workInfo}>
                    <View style={styles.workItem}>
                      <IconSymbol name="briefcase" size={16} color={theme.colors.tint} />
                      <Text style={[styles.workText, { color: theme.colors.text }]}>
                        {selectedDeveloper.occupation}
                      </Text>
                    </View>
                    <View style={styles.workItem}>
                      <IconSymbol name="building.2" size={16} color={theme.colors.tint} />
                      <Text style={[styles.workText, { color: theme.colors.text }]}>
                        {selectedDeveloper.company}
                      </Text>
                    </View>
                    <View style={styles.workItem}>
                      <IconSymbol name="calendar" size={16} color={theme.colors.tint} />
                      <Text style={[styles.workText, { color: theme.colors.text }]}>
                        Joined {selectedDeveloper.joinedDate}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* Skills */}
              <Animated.View entering={FadeInUp.delay(500).springify()}>
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Skills
                  </Text>
                  <View style={styles.skillsContainer}>
                    {selectedDeveloper.skills.map((skill, index) => (
                      <View 
                        key={skill}
                        style={[styles.skillTag, { backgroundColor: theme.colors.tint + '20' }]}
                      >
                        <Text style={[styles.skillText, { color: theme.colors.tint }]}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Animated.View>

              {/* Action Buttons */}
              <Animated.View entering={FadeInUp.delay(600).springify()}>
                <View style={styles.actionButtons}>
                  {friendRequests.includes(selectedDeveloper.username) ? (
                    <TouchableOpacity
                      style={[styles.profileActionButton, { backgroundColor: theme.colors.error + '20' }]}
                      onPress={() => handleCancelFriendRequest(selectedDeveloper.username)}
                    >
                      <IconSymbol name="person.badge.minus" size={20} color={theme.colors.error} />
                      <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
                        Cancel Request
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.profileActionButton, { backgroundColor: theme.colors.tint }]}
                      onPress={() => handleAddFriend(selectedDeveloper.username)}
                    >
                      <IconSymbol name="person.badge.plus" size={20} color="#FFFFFF" />
                      <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                        Add Friend
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.profileActionButton, { backgroundColor: theme.colors.cardBackground, borderWidth: 1, borderColor: theme.colors.tabIconDefault }]}
                  >
                    <IconSymbol name="message" size={20} color={theme.colors.text} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.tabIconDefault }]}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancelText, { color: theme.colors.secondaryText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create Post
            </Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={[styles.modalPostText, { color: theme.colors.tint }]}>
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={{ padding: responsiveSpacing.md }}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Project (Optional)
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.tabIconDefault,
                }]}
                placeholder="Enter project name..."
                placeholderTextColor={theme.colors.secondaryText}
                value={newPostProject}
                onChangeText={setNewPostProject}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.tabIconDefault,
                }]}
                placeholder="Share your update with the community..."
                placeholderTextColor={theme.colors.secondaryText}
                value={newPostText}
                onChangeText={setNewPostText}
                multiline
                numberOfLines={4}
              />
            </View>

            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]}
                  onPress={() => setSelectedImage(null)}
                >
                  <IconSymbol name="xmark" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: theme.colors.cardBackground }]}
                onPress={handleImagePicker}
              >
                <IconSymbol name="photo" size={20} color={theme.colors.tint} />
                <Text style={[styles.mediaButtonText, { color: theme.colors.text }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: theme.colors.cardBackground }]}
                onPress={handleCamera}
              >
                <IconSymbol name="camera" size={20} color={theme.colors.tint} />
                <Text style={[styles.mediaButtonText, { color: theme.colors.text }]}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  // Create Post Button
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing.md,
    paddingHorizontal: responsiveSpacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: responsiveSpacing.lg,
    gap: responsiveSpacing.sm,
  },
  createButtonText: {
    ...Typography.headline,
    fontWeight: '600',
  },
  // Image styles
  imageContainer: {
    marginBottom: responsiveSpacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.headline,
    fontWeight: '600',
  },
  modalCancelText: {
    ...Typography.body,
  },
  modalPostText: {
    ...Typography.body,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: responsiveSpacing.md,
  },
  inputLabel: {
    ...Typography.subheadline,
    fontWeight: '600',
    marginBottom: responsiveSpacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    fontSize: responsiveFonts.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
    fontSize: responsiveFonts.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: responsiveSpacing.md,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: responsiveSpacing.sm,
    right: responsiveSpacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: responsiveSpacing.md,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing.md,
    borderRadius: BorderRadius.md,
    gap: responsiveSpacing.sm,
  },
  mediaButtonText: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  // Developer Profile Modal styles
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSpacing.lg,
  },
  profileAvatar: {
    fontSize: 64,
    marginRight: responsiveSpacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.title1,
    fontWeight: '700',
    marginBottom: responsiveSpacing.xs,
  },
  profileUsername: {
    ...Typography.body,
    marginBottom: responsiveSpacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
  },
  locationText: {
    ...Typography.subheadline,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: responsiveSpacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.title2,
    fontWeight: '700',
    marginBottom: responsiveSpacing.xs,
  },
  statLabel: {
    ...Typography.caption1,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  sectionContainer: {
    marginBottom: responsiveSpacing.lg,
  },
  bioText: {
    ...Typography.body,
    lineHeight: 22,
  },
  workInfo: {
    gap: responsiveSpacing.sm,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
  },
  workText: {
    ...Typography.body,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveSpacing.sm,
  },
  skillTag: {
    paddingHorizontal: responsiveSpacing.sm,
    paddingVertical: responsiveSpacing.xs,
    borderRadius: BorderRadius.sm,
  },
  skillText: {
    ...Typography.caption1,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: responsiveSpacing.md,
    marginTop: responsiveSpacing.md,
  },
  profileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing.md,
    paddingHorizontal: responsiveSpacing.lg,
    borderRadius: BorderRadius.md,
    gap: responsiveSpacing.sm,
  },
  actionButtonText: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
});