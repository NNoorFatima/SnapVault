// types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  'Profile': undefined;
  'Edit Profile': undefined;
  'Logout': undefined;
  'Contact Us': undefined;
  'Dashboard': undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Usage example for components:
// const navigation = useNavigation<NavigationProp>();
// navigation.navigate('Contact Us');