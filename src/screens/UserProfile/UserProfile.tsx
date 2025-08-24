import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, I18nManager, Alert, RefreshControl} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import BackgroundImage from '../../assets/UserProfileBackground';
import { getUserService } from '../../api/ApiFactory';
import { useFocusEffect } from '@react-navigation/native';

interface UserProfileData {
  name?: string;
  email?: string;
  profile_picture?: string;
  bio?: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    avatar: require('../../assets/temp-pfp.jpg'),
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

const fetchUserProfile = async () => {
  try {
    setIsLoading(true);
    const userService = getUserService();
    const profile: UserProfileData = await userService.getProfile();

    console.log('Fetched user profile:', profile);

    // Use image directly — React Native will handle it.
    const avatarSource = profile.profile_picture
      ? { uri: profile.profile_picture }
      : require('../../assets/temp-pfp.jpg');

    setUserProfile({
      name: profile.name || 'User',
      email: profile.email || 'No email',
      avatar: avatarSource,
      bio: profile.bio || '',
    });

  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    Alert.alert('Error', 'Failed to load user profile. Using default data.');
    setUserProfile({
      name: 'User',
      email: 'No email',
      avatar: require('../../assets/temp-pfp.jpg'),
      bio: '',
    });
  } finally {
    setIsLoading(false);
  }
};


  const refreshProfile = () => {
    fetchUserProfile();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshProfile}
          colors={['#73DBE5']}
          tintColor="#73DBE5"
        />
      }
    >
      <BackgroundImage />
      <UserCard 
        name={userProfile.name}
        email={userProfile.email} 
        avatar={userProfile.avatar}
        bio={userProfile.bio}
      />
    
      <ProfileBottomOptions />
    </ScrollView>
  );
};


export default UserProfile; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 40,
  },

});