import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Keep if used elsewhere, otherwise remove
import { useTranslation } from 'react-i18next'; //for localization
import Toast from 'react-native-toast-message';
import CreateGroupPopup from '../../components/CreateGroupPopup';
import JoinGroupPopup from '../../components/JoinGroupPopup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  // State for popups
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  const [showJoinGroupPopup, setShowJoinGroupPopup] = useState(false);

  // Enhanced colorful group images with better color palette
  const groupImageUrls = [
    'https://placehold.co/200x200/6366F1/FFFFFF', // Indigo
    'https://placehold.co/200x200/10B981/FFFFFF', // Emerald
    'https://placehold.co/200x200/F59E0B/FFFFFF', // Amber
    'https://placehold.co/200x200/EF4444/FFFFFF', // Red
    'https://placehold.co/200x200/8B5CF6/FFFFFF', // Violet
    'https://placehold.co/200x200/06B6D4/FFFFFF', // Cyan
    'https://placehold.co/200x200/84CC16/FFFFFF', // Lime
    'https://placehold.co/200x200/EC4899/FFFFFF', // Pink
  ];

  // Handlers for popup actions
  const handleCreateGroup = (groupData: { name: string; description: string }) => {
    // Here you would typically make an API call to create the group
    console.log('Creating group:', groupData);
    
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Group Created!',
      text2: `Group "${groupData.name}" has been created successfully.`,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleJoinGroup = (groupData: { code: string }) => {
    // Here you would typically make an API call to join the group
    console.log('Joining group with code:', groupData.code);
    
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Group Joined!',
      text2: `You have successfully joined the group.`,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const screenWidth = Dimensions.get('window').width;
  const contentWrapperWidth = Math.min(screenWidth - 32, 420);
  const {t} = useTranslation();

  return (
    <View style={styles.container}> {/* Main background is black */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, { width: contentWrapperWidth }]}>

          {/* Status Bar Spacer */}
          <View style={styles.statusBarSpacer} />

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.profilePicContainer}>
                <Image
                  source={require('./img/person-icon.png')}
                  style={styles.profilePic}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingSubtext}>{t('Dashboard.welcome')}</Text>
                <Text style={styles.greetingText}>Muhammad Waleed</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* SnapVault Introduction Card with BACKGROUND IMAGE and Border */}
          <ImageBackground
            // === PLACE YOUR IMAGE SOURCE HERE ===
            // For a remote image: 
            source={require('./img/background.png')}
            // For a local image (assuming it's in an 'assets' folder at the project root, e.g., assets/intro_bg.png):
            // source={require('../../assets/intro_bg.png')}
            // You might need to adjust the path based on your project structure.
            // ======================================
            resizeMode="cover" // 'cover', 'contain', 'stretch', 'repeat', 'center'
            style={styles.introCardImageBackground} // Apply styles for sizing, border, and rounded corners
            imageStyle={styles.introCardImageStyle} // Styles specific to the image itself
          >
            <View style={styles.introContentWrapper}> {/* Wrapper for content inside ImageBackground */}
              <View style={styles.introHeader}>
                <Text style={styles.appTitle}>SnapVault</Text>
                <Text style={styles.versionTag}>v2.1</Text>
              </View>
              <Text style={styles.introText}>
                {t('Dashboard.introText')}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.joinButton]}
                  onPress={() => setShowJoinGroupPopup(true)}
                >
                  <View style={styles.buttonIconContainer}>
                    <Text style={styles.buttonIcon}>👥</Text>
                  </View>
                  <Text style={styles.buttonText}>{t('Dashboard.joinGrps')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.createButton]}
                  onPress={() => setShowCreateGroupPopup(true)}
                >
                  <View style={styles.buttonIconContainer}>
                    <Text style={styles.buttonIcon}>➕</Text>
                  </View>
                  <Text style={styles.buttonText}>{t('Dashboard.createGrps')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>{t('Dashboard.groups')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>{t('Dashboard.photos')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.3GB</Text>
              <Text style={styles.statLabel}>{t('Dashboard.storage')}</Text>
            </View>
          </View>
          <View style={styles.myGroupsHeader}>
            <Text style={styles.myGroupsTitle}>{t('Dashboard.myGroups')}</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>{t('Dashboard.view')}</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>
 
          <ImageBackground
            // === PLACE YOUR IMAGE SOURCE HERE ===
            // For a remote image: 
            source={require('./img/background2.png')}
            // For a local image (assuming it's in an 'assets' folder at the project root, e.g., assets/intro_bg.png):
            // source={require('../../assets/intro_bg.png')}
            // You might need to adjust the path based on your project structure.
            // ======================================
            resizeMode="cover" // 'cover', 'contain', 'stretch', 'repeat', 'center'
            style={styles.introCardImageBackground} // Apply styles for sizing, border, and rounded corners
            imageStyle={styles.introCardImageStyle} // Styles specific to the image itself
          >

            {/* Image Grid */}
            <View style={styles.imageGrid}>
              {groupImageUrls.map((src, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.imageWrapper} 
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('GroupScreen', {
                      groupId: index + 1,
                      groupName: `Group ${index + 1}`,
                      groupDescription: `This is the description for Group ${index + 1}. A wonderful group for sharing memories and photos.`,
                      groupCode: `GRP${String(index + 1).padStart(3, '0')}`
                    });
                  }}
                >
                  <Image
                    source={require('./img/group1.png')}
                    style={styles.groupImage}
                    onError={() => console.warn(`Failed to load image: ${src}`)}
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.groupName}>Group {index + 1}</Text>
                    <Text style={styles.memberCount}>{Math.floor(Math.random() * 20) + 3} members</Text>
                  </View>
                </TouchableOpacity>
              ))} 
            </View>
          </ImageBackground> {/* Close Groups Section Gradient */}


          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Popup Components */}
      <CreateGroupPopup
        visible={showCreateGroupPopup}
        onClose={() => setShowCreateGroupPopup(false)}
        onGroupCreated={handleCreateGroup}
      />
      
      <JoinGroupPopup
        visible={showJoinGroupPopup}
        onClose={() => setShowJoinGroupPopup(false)}
        onGroupJoined={handleJoinGroup}
      />
    </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Main background is black
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 50,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0F0F23',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0F0F23',
  },

  // Intro Card Styles - Now applied to ImageBackground
  introCardImageBackground: { // Style for the ImageBackground component
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9573e5', // Specific border color
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden', // Crucial to clip children (like the image) to rounded corners
  },
  introCardImageStyle: { // Style applied directly to the image within ImageBackground
    borderRadius: 24, // Match the parent border radius
  },
  introContentWrapper: { // New wrapper to apply padding to content inside ImageBackground
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)', // Optional: Add a subtle overlay for text readability
    borderRadius: 24, // Match parent border radius
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  versionTag: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  introText: {
    color: '#F1F5F9',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButton: {
    backgroundColor: '#DE6CED',
  },
  createButton: {
    backgroundColor: '#6366F1',
  },
  buttonIconContainer: {
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  // Stats Styles (unchanged)
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },

  // My Groups Section - LinearGradient wrapper
  groupsSectionGradient: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9573e5', // Specific border color
    padding: 24, // Added padding inside the gradient wrapper
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  myGroupsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  myGroupsTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  viewAllText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  viewAllArrow: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },

  imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 5,
  paddingHorizontal: 10, 
  justifyContent: 'space-between', // Distribute items across the row
},
imageWrapper: {
  width: '48%',
  height: 140,
  borderRadius: 20,
  overflow: 'hidden',
  position: 'relative',
  marginBottom: 16, // acts like "row gap"
  backgroundColor: '#1F2937',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 6, 
  borderWidth: 0, 
},

  groupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.7)', // Semi-transparent dark overlay for text readability
    padding: 12,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberCount: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '400',
  },

  bottomSpacer: {
    height: 40,
  },
});

export default DashboardScreen;