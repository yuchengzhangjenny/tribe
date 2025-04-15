import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import ProgressBar from '../../components/registration/ProgressBar';
import NavigationButtons from '../../components/registration/NavigationButtons';
import { createUserProfile } from '../../services/userService';
import { getAuth } from 'firebase/auth';

type Props = {
  navigation: any;
};

const RegistrationCompleteScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData } = useRegistration();
  const [loading, setLoading] = useState(false);
  
  const handleEnterApp = async () => {
    try {
      setLoading(true);
      
      // Log the registration data
      console.log('Registration data:', registrationData);
      
      // Get the current user
      const firebaseAuth = getAuth();
      const currentUser = firebaseAuth.currentUser;
      
      if (!currentUser) {
        console.error('No user is signed in');
        Alert.alert('Error', 'Authentication error. Please try again.');
        setLoading(false);
        return;
      }
      
      // Map registration data to UserProfile format
      const userProfileData = {
        displayName: registrationData.fullName || '',
        email: currentUser.email || '',
        photoURL: registrationData.profileImages ? registrationData.profileImages[0] : undefined,
        age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : undefined,
        gender: registrationData.gender,
        hometown: registrationData.hometown,
        location: registrationData.currentLocation ? {
          city: registrationData.currentLocation.split(',')[0]?.trim() || '',
          state: registrationData.currentLocation.split(',')[1]?.trim() || '',
          country: registrationData.currentLocation.split(',')[2]?.trim() || '',
        } : undefined,
        occupation: registrationData.profession,
        school: registrationData.school,
        hobbies: registrationData.hobbies,
        bio: registrationData.usageReason,
      };
      
      // Create the user profile in Firebase
      await createUserProfile(currentUser.uid, userProfileData);
      
      // Navigate to the main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Failed to complete registration:', error);
      Alert.alert('Error', 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressBar currentStep={10} totalSteps={10} />

        <View style={styles.mainContent}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkText}>✓</Text>
          </View>
          
          <Text style={styles.title}>All set!</Text>
          <Text style={styles.subtitle}>
            Your profile has been created successfully.
          </Text>
          
          <Text style={styles.message}>
            Thank you for joining our community. We're excited to have you on board and can't wait 
            for you to start connecting with others.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Setting up your profile...</Text>
          </View>
        ) : (
          <NavigationButtons
            onNext={handleEnterApp}
            nextLabel="Start Exploring"
            showBackButton={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  checkText: {
    color: 'white',
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default RegistrationCompleteScreen;