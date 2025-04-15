import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
  Auth: undefined;
  Registration: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;
export type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>; 