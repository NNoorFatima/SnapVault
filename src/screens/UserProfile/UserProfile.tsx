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
          console.log('=== PROFILE PICTURE DEBUG ===');
          console.log('Original profile_picture:', profile.profile_picture);
          console.log('Type of profile_picture:', typeof profile.profile_picture);
          
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
            avatarSource = { uri: fullImageUrl };
          } else {
            console.log('❌ Profile picture URL returned status:', testResponse.status);
            console.log('Response text:', await testResponse.text());
            avatarSource = require('../../assets/temp-pfp.jpg');
          }
        } catch (error) {
          console.log('❌ Error during profile picture processing:', error);
          console.log('Error details:', error instanceof Error ? error.message : String(error));
          avatarSource = require('../../assets/temp-pfp.jpg');
        }
      } else {
        console.log('No profile picture found in response, using fallback');
      }
      
      console.log('Final avatarSource:', avatarSource);
      console.log('=== END PROFILE PICTURE DEBUG ===');
      
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