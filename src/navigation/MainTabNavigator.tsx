import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashBoard/DashboardScreen';
import ContactUs from '../screens/ContactUs/ContactUs';
import UserProfile from '../screens/UserProfile/UserProfile';
import EditProfile from '../screens/UserProfile/EditProfile';
import Icon from 'react-native-vector-icons/Ionicons';

export type MainTabParamList = {
  Dashboard: undefined;
  ContactUs: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {/* Dashboard (left) */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Icon
          name={state.index === 0 ? 'home' : 'home-outline'}
          size={32}
          color={state.index === 0 ? '#6BDCE1' : '#fff'}
        />
      </TouchableOpacity>
      {/* ContactUs (center) */}
      <TouchableOpacity
        style={[styles.tabButton, styles.centerTab]}
        onPress={() => navigation.navigate('ContactUs')}
      >
        <Icon
          name={state.index === 1 ? 'call' : 'call-outline'}
          size={32}
          color={state.index === 1 ? '#6BDCE1' : '#fff'}
        />
      </TouchableOpacity>
      {/* Profile (right) */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon
          name={state.index === 2 ? 'person' : 'person-outline'}
          size={32}
          color={state.index === 2 ? '#6BDCE1' : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#1B1C41',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTab: {
    flex: 1.2,
  },
});

const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="ContactUs" component={ContactUs} />
    <Tab.Screen name="Profile" component={UserProfile} />
    <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton: () => null }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
