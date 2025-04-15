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

const SchoolScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [school, setSchool] = useState(registrationData.school || '');

  const handleNext = () => {
    const trimmedSchool = school.trim();
    updateRegistrationData({ school: trimmedSchool });
    navigation.navigate('Purpose');
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
          <ProgressBar currentStep={6} totalSteps={10} />

          <View style={styles.content}>
            <Text style={styles.title}>Where did you study?</Text>
            <Text style={styles.subtitle}>
              Enter your school, college, or university
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={setSchool}
                placeholder="Enter your educational institution"
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </View>

            <Text style={styles.helperText}>
              This field is optional. You can leave it blank if you prefer not to share.
            </Text>
          </View>

          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={school.trim() === '' ? 'Skip' : 'Next'}
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
  helperText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SchoolScreen; 