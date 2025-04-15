import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import ProgressBar from '../../components/registration/ProgressBar';
import NavigationButtons from '../../components/registration/NavigationButtons';

type Props = {
  navigation: any;
};

const ProfessionScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [profession, setProfession] = useState(registrationData.profession || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (profession.trim() === '') {
      setError('Please enter your profession');
      return;
    }

    setError('');
    updateRegistrationData({ profession: profession.trim() });
    navigation.navigate('School');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar currentStep={5} totalSteps={10} />

          <View style={styles.content}>
            <Text style={styles.title}>What do you do?</Text>
            <Text style={styles.subtitle}>
              Enter your current profession or occupation
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={profession}
                onChangeText={(text) => {
                  setProfession(text);
                  if (error) setError('');
                }}
                placeholder="Enter your profession"
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <Text style={styles.helperText}>
              Examples: Software Engineer, Teacher, Marketing Manager, Artist, Student
            </Text>
          </View>

          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            isNextDisabled={profession.trim() === ''}
          />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 5,
    fontSize: 14,
  },
  helperText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfessionScreen; 