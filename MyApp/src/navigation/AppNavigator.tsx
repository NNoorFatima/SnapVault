import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import UserProfile from '../screens/UserProfile/UserProfile';
import EditProfile from '../screens/UserProfile/EditProfile';
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Edit Profile">
      {/* <Stack.Screen name="Profile" component={UserProfile} /> */}
      <Stack.Screen name="Edit Profile" component={EditProfile} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
