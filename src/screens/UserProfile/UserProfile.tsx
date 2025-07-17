import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, I18nManager, Alert, RefreshControl} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import BackgroundImage from '../../assets/UserProfileBackground';
import { profileService } from '../../api/services/ProfileService';
import { apiConfig } from '../../api/config/ApiConfig';

interface UserProfileData {
  name?: string;
  phone?: string;
  email?: string;
  profile_picture?: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    phone: '',
    email: '',
    avatar: require('../../assets/temp-pfp.jpg')
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile: UserProfileData = await profileService.getProfile();
      
      console.log('Fetched user profile:', profile);
      
      // Handle profile picture with fallback
      let avatarSource = require('../../assets/temp-pfp.jpg');
      
      if (profile.profile_picture) {
        try {
          // Try to load the profile picture from the backend
          avatarSource = { uri: `${apiConfig.getBaseURL()}${profile.profile_picture}` };
        } catch (error) {
          console.log('Failed to load profile picture, using fallback:', error);
          avatarSource = require('../../assets/temp-pfp.jpg');
        }
      }
      
      setUserProfile({
        name: profile.name || 'User',
        phone: profile.phone || 'No phone',
        email: profile.email || 'No email',
        avatar: avatarSource
      });
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      Alert.alert('Error', 'Failed to load user profile. Using default data.');
      
      // Set default data on error
      setUserProfile({
        name: 'User',
        phone: 'No phone',
        email: 'No email',
        avatar: require('../../assets/temp-pfp.jpg')
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
        phone={userProfile.phone} 
        email={userProfile.email} 
        avatar={userProfile.avatar}
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