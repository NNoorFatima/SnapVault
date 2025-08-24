import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignIn/SignInScreen';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = (props: any) => (
  <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn">
      {navProps => <SignInScreen {...navProps} onSignIn={props.onSignIn} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
