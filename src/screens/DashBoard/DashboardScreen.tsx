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
import { getUserService, getGroupsService } from '../../api/ApiFactory';


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


interface GroupData {
  id: number;
  name: string;
  description: string;
  code: string;
  memberCount: number;
  image: any;
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
  const [groupsData, setGroupsData] = useState<GroupData[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  
  //for localization
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserProfile();
    fetchGroupsData();
  }, []);

  const fetchGroupsData = async () => {
    try {
      console.log('🔄 Starting to fetch groups data...');
      setGroupsLoading(true);
      
      const groupsService = getGroupsService();
      console.log('✅ Groups service obtained');
      
      const response = await groupsService.getMyGroups();
      console.log('📡 API Response received:', response);
      
      if (response && Array.isArray(response)) {
        const transformedGroups = response.map(group => {
          console.log('🔄 Transforming group:', group);
          console.log('🔍 Original group ID:', group.id, 'Type:', typeof group.id);
          console.log('🔍 Creator info:', group.creator);
          
          return {
            id: group.id,
            name: group.name,
            description: group.description || 'No description available',
            code: group.invite_code,
            memberCount: 0, // We'll add this later if needed
            image: require('../../assets/temp-pfp.jpg'), // Using temp-pfp as fallback
            creator: group.creator // Include creator information
          };
        });
        
        console.log('🔄 Transformed groups data:', transformedGroups);
        setGroupsData(transformedGroups);
        console.log(`✅ Successfully loaded ${transformedGroups.length} groups`);
      } else {
        console.log('⚠️ No groups data or invalid response format');
        setGroupsData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching groups:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      setGroupsData([]);
      
      // Show error toast only for non-network errors
      if (error instanceof Error && !error.message.includes('Network')) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load groups. Please try again.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } finally {
      setGroupsLoading(false);
      console.log('🏁 Finished fetching groups data');
    }
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userService = getUserService();
      const profile: UserProfileData = await userService.getProfile();
      
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
          
          // Use the API config from the service
          const baseURL = userService.config.getBaseURL();
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
  // const groupsData = [
  //   {
  //     id: 1,
  //     name: 'Group 1',
  //     description: 'This is the description for Group 1. A wonderful group for sharing memories and photos.',
  //     code: 'GRP001',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 2,
  //     name: 'Group 2',
  //     description: 'This is the description for Group 2. A wonderful group for sharing memories and photos.',
  //     code: 'GRP002',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 3,
  //     name: 'Group 3',
  //     description: 'This is the description for Group 3. A wonderful group for sharing memories and photos.',
  //     code: 'GRP003',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 4,
  //     name: 'Group 4',
  //     description: 'This is the description for Group 4. A wonderful group for sharing memories and photos.',
  //     code: 'GRP004',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 5,
  //     name: 'Group 5',
  //     description: 'This is the description for Group 5. A wonderful group for sharing memories and photos.',
  //     code: 'GRP005',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 6,
  //     name: 'Group 6',
  //     description: 'This is the description for Group 6. A wonderful group for sharing memories and photos.',
  //     code: 'GRP006',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 7,
  //     name: 'Group 7',
  //     description: 'This is the description for Group 7. A wonderful group for sharing memories and photos.',
  //     code: 'GRP007',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  //   {
  //     id: 8,
  //     name: 'Group 8',
  //     description: 'This is the description for Group 8. A wonderful group for sharing memories and photos.',
  //     code: 'GRP008',
  //     memberCount: Math.floor(Math.random() * 20) + 3,
  //     image: require('./img/group1.png'),
  //   },
  // ];

  const statsData = [
    { value: groupsData.length.toString(), label: t('Dashboard.groups') },
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
  const handleCreateGroup = async (groupData: { name: string; description: string }) => {
    try {
      console.log('🔄 Creating group:', groupData);
      
      const groupsService = getGroupsService();
      console.log('✅ Groups service obtained for creation');
      
      const response = await groupsService.createGroup(groupData);
      console.log('📡 Group creation API response:', response);
      
      Toast.show({
        type: 'success',
        text1: 'Group Created!',
        text2: `Group "${groupData.name}" has been created successfully.`,
        position: 'bottom',
        visibilityTime: 3000,
      });
      
      // Refresh groups data to show the new group
      console.log('🔄 Refreshing groups data after creation...');
      await fetchGroupsData();
      
    } catch (error) {
      console.error('❌ Failed to create group:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to create group. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleJoinGroup = async (groupData: { code: string }) => {
    try {
      console.log('🔄 Joining group with code:', groupData.code);
      
      const groupsService = getGroupsService();
      console.log('✅ Groups service obtained for joining');
      
      const response = await groupsService.joinGroup({ invite_code: groupData.code });
      console.log('📡 Group join API response:', response);
      
      Toast.show({
        type: 'success',
        text1: 'Group Joined!',
        text2: `You have successfully joined the group.`,
        position: 'bottom',
        visibilityTime: 3000,
      });
      
      // Refresh groups data to show the joined group
      console.log('🔄 Refreshing groups data after joining...');
      await fetchGroupsData();
      
    } catch (error) {
      console.error('❌ Failed to join group:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to join group. Please check the invite code and try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleGroupPress = (groupData: {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
  }) => {
    console.log('🔄 Navigating to group screen with data:', groupData);
    console.log('🔍 Group ID being sent:', groupData.groupId);
    console.log('🔍 Group ID type:', typeof groupData.groupId);
    
    // Find the full group data from our groupsData array
    const fullGroupData = groupsData.find(group => group.id === groupData.groupId);
    console.log('🔍 Full group data found:', fullGroupData);
    
    // Navigate to the nested GroupScreen stack
    navigation.navigate('GroupScreen', {
      screen: 'GroupScreen',
      params: {
        groupId: groupData.groupId,
        groupName: groupData.groupName,
        groupDescription: groupData.groupDescription,
        groupCode: groupData.groupCode,
        fullGroupData: fullGroupData // Pass the complete group data
      }
    });
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