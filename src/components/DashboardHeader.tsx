import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/MainTabNavigator';

interface DashboardHeaderProps {
  navigation: BottomTabNavigationProp<MainTabParamList>;
  userName: string;
  userImage: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  navigation,
  userName,
  userImage,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')} 
          style={styles.profilePicContainer}
        >
          <Image
            source={userImage}
            style={styles.profilePic}
          />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
        <View>
          <Text style={styles.greetingText}>{userName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  greetingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

export default DashboardHeader; 