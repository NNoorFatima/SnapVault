import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ListRenderItem, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
// Import new components
import DashboardHeader from '../../components/DashboardHeader';
import IntroCard from '../../components/IntroCard';
import StatsSection from '../../components/StatsSection';
import GroupsSection from '../../components/GroupsSection';
import CreateGroupPopup from '../../components/CreateGroupPopup';
import JoinGroupPopup from '../../components/JoinGroupPopup';
import { profileService } from '../../api/services/ProfileService';
import { apiConfig } from '../../api/config/ApiConfig';

type DashboardScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

interface DashboardSection {
  id: string;
  type: 'header' | 'intro' | 'stats' | 'groups' | 'spacer';
  data?: any;
}

interface UserProfileData {
  name?: string;
  phone?: string;
  email?: string;
  profile_picture?: string;
}

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  // State for popups
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  const [showJoinGroupPopup, setShowJoinGroupPopup] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    userImage: require('../../assets/temp-pfp.jpg')
  });
  const [isLoading, setIsLoading] = useState(true);
  
  //for localization
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile: UserProfileData = await profileService.getProfile();
      
      console.log('Fetched user profile for dashboard:', profile);
      
      // Handle profile picture with fallback
      let userImage = require('../../assets/temp-pfp.jpg');
      
      if (profile.profile_picture) {
        try {
          console.log('Profile picture path:', profile.profile_picture);
          
          // Normalize the path - convert Windows backslashes to forward slashes
          let imagePath = profile.profile_picture.replace(/\\/g, '/');
          console.log('Normalized imagePath:', imagePath);
          
          // Check if the path already starts with /uploads
          if (!imagePath.startsWith('/uploads')) {
            // If it's a relative path like "uploads/profile_pictures/...", convert it
            if (imagePath.startsWith('uploads/')) {
              imagePath = '/' + imagePath;
              console.log('Converted uploads/ path to:', imagePath);
            } else {
              // If it's just a filename, assume it's in profile_pictures
              imagePath = `/uploads/profile_pictures/${imagePath}`;
              console.log('Converted filename to:', imagePath);
            }
          }
          
          const baseURL = apiConfig.getBaseURL();
          console.log('Base URL:', baseURL);
          const fullImageUrl = `${baseURL}${imagePath}`;
          console.log('Full image URL:', fullImageUrl);
          
          // Test if the image URL is accessible
          console.log('Testing URL accessibility...');
          const testResponse = await fetch(fullImageUrl, { method: 'HEAD' });
          console.log('Response status:', testResponse.status);
          console.log('Response headers:', testResponse.headers);
          
          if (testResponse.ok) {
            console.log('✅ Profile picture URL is accessible');
            userImage = { uri: fullImageUrl };
          } else {
            console.log('❌ Profile picture URL returned status:', testResponse.status);
            console.log('Response text:', await testResponse.text());
            userImage = require('../../assets/temp-pfp.jpg');
          }
        } catch (error) {
          console.log('❌ Error during profile picture processing:', error);
          console.log('Error details:', error instanceof Error ? error.message : String(error));
          userImage = require('../../assets/temp-pfp.jpg');
        }
      } else {
        console.log('No profile picture found, using fallback');
      }
      
      setUserProfile({
        name: profile.name || 'User',
        userImage: userImage
      });
      
    } catch (error) {
      console.error('Failed to fetch user profile for dashboard:', error);
      Alert.alert('Error', 'Failed to load user profile. Using default data.');
      
      // Set default data on error
      setUserProfile({
        name: 'User',
        userImage: require('../../assets/temp-pfp.jpg')
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data - in a real app, this would come from state management or API
  const groupsData = [
    {
      id: 1,
      name: 'Group 1',
      description: 'This is the description for Group 1. A wonderful group for sharing memories and photos.',
      code: 'GRP001',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 2,
      name: 'Group 2',
      description: 'This is the description for Group 2. A wonderful group for sharing memories and photos.',
      code: 'GRP002',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 3,
      name: 'Group 3',
      description: 'This is the description for Group 3. A wonderful group for sharing memories and photos.',
      code: 'GRP003',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 4,
      name: 'Group 4',
      description: 'This is the description for Group 4. A wonderful group for sharing memories and photos.',
      code: 'GRP004',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 5,
      name: 'Group 5',
      description: 'This is the description for Group 5. A wonderful group for sharing memories and photos.',
      code: 'GRP005',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 6,
      name: 'Group 6',
      description: 'This is the description for Group 6. A wonderful group for sharing memories and photos.',
      code: 'GRP006',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 7,
      name: 'Group 7',
      description: 'This is the description for Group 7. A wonderful group for sharing memories and photos.',
      code: 'GRP007',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
    {
      id: 8,
      name: 'Group 8',
      description: 'This is the description for Group 8. A wonderful group for sharing memories and photos.',
      code: 'GRP008',
      memberCount: Math.floor(Math.random() * 20) + 3,
      image: require('./img/group1.png'),
    },
  ];

  const statsData = [
    { value: '8', label: t('Dashboard.groups') },
    { value: '124', label: t('Dashboard.photos') },
    { value: '2.3GB', label: t('Dashboard.storage') },
  ];

  // Create sections for FlatList
  const dashboardSections: DashboardSection[] = [
    { id: 'header', type: 'header' },
    { id: 'intro', type: 'intro' },
    { id: 'stats', type: 'stats', data: statsData },
    { id: 'groups', type: 'groups', data: groupsData },
    { id: 'spacer', type: 'spacer' },
  ];

  // Handlers for popup actions
  const handleCreateGroup = (groupData: { name: string; description: string }) => {
    console.log('Creating group:', groupData);
    
    Toast.show({
      type: 'success',
      text1: 'Group Created!',
      text2: `Group "${groupData.name}" has been created successfully.`,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleJoinGroup = (groupData: { code: string }) => {
    console.log('Joining group with code:', groupData.code);
    
    Toast.show({
      type: 'success',
      text1: 'Group Joined!',
      text2: `You have successfully joined the group.`,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleGroupPress = (groupData: {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
  }) => {
    navigation.navigate('GroupScreen', groupData);
  };

  const handleViewAllGroups = () => {
    navigation.navigate('AllGroups', { groups: groupsData });
  };

  const screenWidth = Dimensions.get('window').width;
  const contentWrapperWidth = Math.min(screenWidth - 32, 420);

  const renderDashboardSection: ListRenderItem<DashboardSection> = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <DashboardHeader
            navigation={navigation}
            userName={userProfile.name}
            userImage={userProfile.userImage}
          />
        );
      
      case 'intro':
        return (
          <IntroCard
            appTitle="SnapVault"
            version="v2.1"
            description={t('Dashboard.introText')}
            backgroundImage={require('./img/background2.png')}
            onJoinGroup={() => setShowJoinGroupPopup(true)}
            onCreateGroup={() => setShowCreateGroupPopup(true)}
            joinButtonText={t('Dashboard.joinGrps')}
            createButtonText={t('Dashboard.createGrps')}
          />
        );
      
      case 'stats':
        return <StatsSection stats={item.data} />;
      
      case 'groups':
        return (
          <GroupsSection
            title={t('Dashboard.myGroups')}
            viewAllText={t('Dashboard.view')}
            groups={item.data}
            backgroundImage={require('./img/background2.png')}
            onViewAll={handleViewAllGroups}
            onGroupPress={handleGroupPress}
          />
        );
      
      case 'spacer':
        return <View style={styles.bottomSpacer} />;
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dashboardSections}
        renderItem={renderDashboardSection}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.flatListContent, { width: contentWrapperWidth }]}
        style={styles.flatList}
      />

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
    backgroundColor: '#000',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingTop: 0,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default DashboardScreen;