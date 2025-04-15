import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

const ProfilePictureScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [profileImage, setProfileImage] = useState<string | null>(
    registrationData.profileImages && registrationData.profileImages.length > 0
      ? registrationData.profileImages[0]
      : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is required to take photos',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library access is required to select photos',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      setIsUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        setError('');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to take photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const selectFromLibrary = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        setError('');
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      setError('Failed to select photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (!profileImage) {
      Alert.alert(
        'No Photo Added',
        'Are you sure you want to proceed without adding a profile photo?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('Hobbies');
            },
          },
        ]
      );
      return;
    }

    // Save the profile image in the registration context
    updateRegistrationData({
      profileImages: [profileImage]
    });
    
    navigation.navigate('Hobbies');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '90%' }]} />
            </View>
            <Text style={styles.progressText}>10 of 11</Text>
          </View>

          <ScrollView style={styles.mainContent}>
            <Text style={styles.title}>Add a profile photo</Text>
            <Text style={styles.subtitle}>
              Add a photo that clearly shows your face
            </Text>

            <View style={styles.photoContainer}>
              {isUploading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3498db" />
                  <Text style={styles.loadingText}>Processing photo...</Text>
                </View>
              ) : profileImage ? (
                <View style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.photoOptions}>
                    <TouchableOpacity
                      style={styles.photoOptionButton}
                      onPress={takePhoto}
                    >
                      <Ionicons name="camera" size={24} color="#3498db" />
                      <Text style={styles.photoOptionText}>Take New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoOptionButton}
                      onPress={selectFromLibrary}
                    >
                      <Ionicons name="image" size={24} color="#3498db" />
                      <Text style={styles.photoOptionText}>Choose New</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={80} color="#ccc" />
                  </View>
                  <View style={styles.photoOptions}>
                    <TouchableOpacity
                      style={styles.photoOptionButton}
                      onPress={takePhoto}
                    >
                      <Ionicons name="camera" size={24} color="#3498db" />
                      <Text style={styles.photoOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoOptionButton}
                      onPress={selectFromLibrary}
                    >
                      <Ionicons name="image" size={24} color="#3498db" />
                      <Text style={styles.photoOptionText}>Upload Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Text style={styles.tipText}>
              Tip: Photos where your face is clearly visible work best.
            </Text>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {profileImage ? 'Next' : 'Skip for now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
  },
  progress: {
    height: 8,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    width: 50,
    textAlign: 'right',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  imageWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    width: '100%',
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  photoOptionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
    padding: 10,
  },
  photoOptionText: {
    color: '#3498db',
    marginTop: 5,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#b2d6f5',
  },
});

export default ProfilePictureScreen;