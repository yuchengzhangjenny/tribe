import React, { useState } from 'react';
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
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

const NameScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [name, setName] = useState(registrationData.fullName || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    // Trim the name to remove any leading/trailing whitespace
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    
    // Check if name contains at least first and last name
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) {
      setError('Please enter your full name (first and last name)');
      return;
    }
    
    // Clear any errors and update registration data
    setError('');
    updateRegistrationData({ fullName: trimmedName });
    navigation.navigate('CurrentLocation');
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
                <View style={[styles.progress, { width: '10%' }]} />
              </View>
              <Text style={styles.progressText}>1 of 10</Text>
            </View>

            <View style={styles.mainContent}>
              <Text style={styles.title}>What's your name?</Text>
              <Text style={styles.subtitle}>
                Please enter your full name as it appears on official documents
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (error) setError('');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNext}
              >
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
    marginTop: 10,
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
  buttonContainer: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NameScreen; 