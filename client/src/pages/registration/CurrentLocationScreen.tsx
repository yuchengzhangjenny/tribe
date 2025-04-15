import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import * as Location from 'expo-location';

type Props = {
  navigation: any;
};

const CurrentLocationScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [location, setLocation] = useState(registrationData.currentLocation || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required to automatically detect your location');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const { city, region, country } = geocode[0];
        const formattedLocation = [city, region, country].filter(Boolean).join(', ');
        setLocation(formattedLocation);
      } else {
        setError('Could not determine your location');
      }
    } catch (err) {
      setError('Error detecting your location. Please enter it manually.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!registrationData.currentLocation) {
      requestLocationPermission();
    }
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!location.trim()) {
      setError('Please enter your current location');
      return;
    }

    // Clear any errors and update registration data
    setError('');
    updateRegistrationData({ currentLocation: location.trim() });
    navigation.navigate('Gender');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '20%' }]} />
              </View>
              <Text style={styles.progressText}>2 of 10</Text>
            </View>

            <View style={styles.mainContent}>
              <Text style={styles.title}>Where are you based?</Text>
              <Text style={styles.subtitle}>
                Your current city or region where you're living
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Your current location"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (error) setError('');
                  }}
                  autoCorrect={false}
                  editable={!loading}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.detectButton}
                onPress={requestLocationPermission}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.detectButtonText}>Detect My Location</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  detectButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  detectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CurrentLocationScreen;