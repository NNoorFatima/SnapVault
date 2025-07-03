import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // No auth yet

  useEffect(() => {
    // Simulate splash loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingDone ? (
          <Stack.Screen name="Onboarding">
            {props => (
              <OnboardingScreen
                {...props}
                onFinish={() => setIsOnboardingDone(true)}
              />
            )}
          </Stack.Screen>
        ) : !isLoggedIn ? (
          <Stack.Screen name="Auth">
            {props => <AuthNavigator {...props} onSignIn={() => setIsLoggedIn(true)} />} 
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
