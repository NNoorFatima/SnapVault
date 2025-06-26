import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import UserProfile from '../screens/UserProfile/UserProfile';
import EditProfile from '../screens/UserProfile/EditProfile';
import Logout from '../screens/UserProfile/Logout';
// Define route names inline here
export type RootStackParamList = {
  'Edit Profile': undefined;
  'Profile': undefined;
  'Logout': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={UserProfile} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
