import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import ProgressBar from '../../components/registration/ProgressBar';
import NavigationButtons from '../../components/registration/NavigationButtons';
import RegistrationQuestion from '../../components/registration/RegistrationQuestion';
import { AppLinkText, AppErrorText } from '../../components/common/AppText';

type Props = {
  navigation: any;
};

const HometownScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [hometown, setHometown] = useState(registrationData.hometown || '');
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    setHometown(text);
    if (error) setError('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!hometown.trim()) {
      setError('Please enter your hometown');
      return;
    }

    // Clear any errors and update registration data
    setError('');
    updateRegistrationData({ hometown: hometown.trim() });
    navigation.navigate('Profession');
  };

  const handleSkip = () => {
    // Skip this step
    setError('');
    navigation.navigate('Profession');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <ProgressBar currentStep={5} totalSteps={10} />

            <View style={styles.mainContent}>
              <RegistrationQuestion 
                title="Where are you from?"
                description="Enter the city or town where you grew up"
              />

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Your hometown"
                  value={hometown}
                  onChangeText={handleChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {error ? <AppErrorText>{error}</AppErrorText> : null}
              </View>

              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleSkip}
              >
                <AppLinkText>Skip this step</AppLinkText>
              </TouchableOpacity>
            </View>

            <NavigationButtons 
              onBack={handleBack}
              onNext={handleNext}
              isNextDisabled={!hometown.trim()}
            />
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
  mainContent: {
    flex: 1,
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
  skipButton: {
    alignSelf: 'center',
    padding: 10,
  },
});

export default HometownScreen;