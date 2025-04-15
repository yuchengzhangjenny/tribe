import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Registration Screens
import {
  NameScreen,
  CurrentLocationScreen,
  GenderScreen,
  DateOfBirthScreen,
  HometownScreen,
  ProfessionScreen,
  SchoolScreen,
  HobbiesScreen,
  PurposeScreen,
  ProfilePictureScreen,
  RegistrationCompleteScreen
} from '../screens/registration';

const Stack = createStackNavigator();

const RegistrationNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Name"
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="CurrentLocation" component={CurrentLocationScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
      <Stack.Screen name="Hometown" component={HometownScreen} />
      <Stack.Screen name="Profession" component={ProfessionScreen} />
      <Stack.Screen name="School" component={SchoolScreen} />
      <Stack.Screen name="Purpose" component={PurposeScreen} />
      <Stack.Screen name="ProfilePicture" component={ProfilePictureScreen} />
      <Stack.Screen name="Hobbies" component={HobbiesScreen} />
      <Stack.Screen name="RegistrationComplete" component={RegistrationCompleteScreen} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator; 