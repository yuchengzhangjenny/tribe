import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RegistrationProvider } from '../contexts/RegistrationContext';
import { auth } from '../firebase/auth';
import { firestore } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

// Import actual screens instead of placeholders
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import RegistrationNavigator from './RegistrationNavigator';
import LoadingScreen from '../screens/LoadingScreen';

// Import main screens
import { PeopleScreen, UserDetailScreen } from '../screens/main';

// Main App Screens (Placeholder components until we implement them)
const HomeScreen = () => <PlaceholderScreen title="Home" />;
const EventsScreen = () => <PlaceholderScreen title="Events" />;
const ProfileScreen = () => <PlaceholderScreen title="Profile" />;
const ChatScreen = () => <PlaceholderScreen title="Chat" />;

// Placeholder component for screens we haven't built yet
import { View, Text, StyleSheet } from 'react-native';
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title} Screen</Text>
    <Text style={styles.subtext}>Coming soon!</Text>
  </View>
);

// Define types for our stack navigators
type RootStackParamList = {
  Auth: undefined;
  Registration: undefined;
  Main: undefined;
  Loading: undefined;
};

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type HomeStackParamList = {
  Home: undefined;
};

type PeopleStackParamList = {
  People: undefined;
  UserDetail: { userId: string };
};

type ProfileStackParamList = {
  Profile: undefined;
};

type ChatStackParamList = {
  Chat: { userId?: string; userName?: string };
};

// Stack Navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const RegistrationStack = createStackNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();
const PeopleStack = createStackNavigator<PeopleStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ChatStack = createStackNavigator<ChatStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Bottom Tab Navigator
const MainTab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Home Stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} />
  </HomeStack.Navigator>
);

// People Stack
const PeopleStackNavigator = () => (
  <PeopleStack.Navigator>
    <PeopleStack.Screen 
      name="People" 
      component={PeopleScreen}
      options={{ headerShown: false }}
    />
    <PeopleStack.Screen 
      name="UserDetail" 
      component={UserDetailScreen}
      options={{ headerShown: false }}
    />
  </PeopleStack.Navigator>
);

// Profile Stack
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Chat Stack
const ChatStackNavigator = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen name="Chat" component={ChatScreen} />
  </ChatStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeStack') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'PeopleStack') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'ProfileStack') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'ChatStack') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <MainTab.Screen 
      name="HomeStack" 
      component={HomeStackNavigator}
      options={{ title: 'Home', headerShown: false }}
    />
    <MainTab.Screen 
      name="PeopleStack" 
      component={PeopleStackNavigator}
      options={{ title: 'People', headerShown: false }} 
    />
    <MainTab.Screen 
      name="ProfileStack" 
      component={ProfileStackNavigator}
      options={{ title: 'Profile', headerShown: false }} 
    />
    <MainTab.Screen 
      name="ChatStack" 
      component={ChatStackNavigator}
      options={{ title: 'Chat', headerShown: false }} 
    />
  </MainTab.Navigator>
);

// Main App Navigator - Switches between Auth, Registration and Main flows
const RootNavigator = () => {
  // Track both authentication and registration completion
  const [userState, setUserState] = useState({
    isLoading: true,
    isAuthenticated: false,
    hasCompletedRegistration: false
  });
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is authenticated
        // Check if user has completed registration
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then(docSnap => {
          if (docSnap.exists()) {
            // User document exists, check profile completeness
            const userData = docSnap.data();
            const isProfileComplete = userData.profile?.profileCompleteness > 0;
            
            setUserState({
              isLoading: false,
              isAuthenticated: true,
              hasCompletedRegistration: isProfileComplete
            });
          } else {
            // User is authenticated but has no profile yet
            setUserState({
              isLoading: false,
              isAuthenticated: true,
              hasCompletedRegistration: false
            });
          }
        }).catch(error => {
          console.error("Error checking profile completion:", error);
          setUserState({
            isLoading: false,
            isAuthenticated: true,
            hasCompletedRegistration: false
          });
        });
      } else {
        // No user is logged in
        setUserState({
          isLoading: false,
          isAuthenticated: false,
          hasCompletedRegistration: false
        });
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      setUserState({
        isLoading: false,
        isAuthenticated: false,
        hasCompletedRegistration: false
      });
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (userState.isLoading) {
    // Show a loading screen while checking auth state
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {userState.isAuthenticated ? (
        userState.hasCompletedRegistration ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Registration" component={RegistrationNavigator} />
        )
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

// Main app navigation container
const AppNavigator = () => {
  return (
    <RegistrationProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </RegistrationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator; 
