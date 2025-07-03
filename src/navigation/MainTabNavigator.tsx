import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#1B1C41',
        borderTopWidth: 0,
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'ContactUs') iconName = focused ? 'call' : 'call-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        return (
          <Icon
            name={iconName}
            size={32}
            color={focused ? '#6BDCE1' : '#fff'}
            style={{ alignSelf: 'center' }}
          />
        );
      },
      tabBarActiveTintColor: '#6BDCE1',
      tabBarInactiveTintColor: '#fff',
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="ContactUs" component={ContactUs} />
    <Tab.Screen name="Profile" component={UserProfile} />
    <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton: () => null }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
