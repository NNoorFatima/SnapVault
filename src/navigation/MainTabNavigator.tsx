import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import DashboardScreen from '../screens/DashBoard/DashboardScreen';
// import ContactUs from '../screens/ContactUs/ContactUs';
import UserProfile from '../screens/UserProfile/UserProfile';
import EditProfile from '../screens/UserProfile/EditProfile';
import GroupScreen from '../screens/GroupScreen/GroupScreen';
import AllGroupsScreen from '../screens/AllGroups/AllGroupsScreen';
// import ImageDetailScreen from '../screens/GroupScreen/ImageDetailScreen';
import Icon from 'react-native-vector-icons/Ionicons';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageDetailScreen from '../screens/GroupScreen/ImageDetailScreen'; // Adjust the path if needed
const Stack = createNativeStackNavigator();


export type MainTabParamList = {
  Dashboard: undefined;
  ContactUs: undefined;
  Profile: undefined;
  EditProfile: undefined;
  GroupScreen: {
    screen?: string;
    params?: {
      groupId: number;
      groupName: string;
      groupDescription: string;
      groupCode: string;
      fullGroupData?: any; // Optional full group data from dashboard
    };
  } | {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
    fullGroupData?: any; // Optional full group data from dashboard
  };
  AllGroups: {
    groups?: Array<{
      id: number;
      name: string;
      description: string;
      code: string;
      memberCount: number;
      image: any;
    }>;
  };
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
      {/* Search (center) */}
      <TouchableOpacity
        style={[styles.tabButton, styles.centerTab]}
        onPress={() => navigation.navigate('AllGroups')}
      >
        <Icon
          name={state.index === 1 ? 'search' : 'search-outline'}
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
    <Tab.Screen name="AllGroups" component={AllGroupsScreen} initialParams={{}} />
    <Tab.Screen name="Profile" component={UserProfile} />
    <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="GroupScreen" component={GroupScreenStack} options={{ tabBarButton: () => null }} />
  </Tab.Navigator>
);

export default MainTabNavigator;


//creating stack for Group screen
const GroupScreenStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GroupScreen"
        component={GroupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{
          headerShown: false,
          // title: 'Image Preview',
          // headerStyle: styles.modalHeader,
          // headerTitleStyle: styles.modalHeaderTitle,
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};