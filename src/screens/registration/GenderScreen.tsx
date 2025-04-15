import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import ProgressBar from '../../components/registration/ProgressBar';
import NavigationButtons from '../../components/registration/NavigationButtons';
import RegistrationQuestion from '../../components/registration/RegistrationQuestion';
import { AppOptionText } from '../../components/common/AppText';

type Props = {
  navigation: any;
};

type GenderOption = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

const GenderScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(
    registrationData.gender as GenderOption || null
  );

  const handleGenderSelect = (gender: GenderOption) => {
    setSelectedGender(gender);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedGender) return;
    
    updateRegistrationData({ gender: selectedGender });
    navigation.navigate('DateOfBirth');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ProgressBar currentStep={3} totalSteps={10} />

          <View style={styles.mainContent}>
            <RegistrationQuestion
              title="What is your gender?"
              description="Select the option that best describes you"
            />

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedGender === 'male' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelect('male')}
              >
                <AppOptionText
                  style={selectedGender === 'male' ? styles.selectedOptionText : undefined}
                >
                  Male
                </AppOptionText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedGender === 'female' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelect('female')}
              >
                <AppOptionText
                  style={selectedGender === 'female' ? styles.selectedOptionText : undefined}
                >
                  Female
                </AppOptionText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedGender === 'non-binary' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelect('non-binary')}
              >
                <AppOptionText
                  style={selectedGender === 'non-binary' ? styles.selectedOptionText : undefined}
                >
                  Non-binary
                </AppOptionText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedGender === 'prefer-not-to-say' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelect('prefer-not-to-say')}
              >
                <AppOptionText
                  style={selectedGender === 'prefer-not-to-say' ? styles.selectedOptionText : undefined}
                >
                  Prefer not to say
                </AppOptionText>
              </TouchableOpacity>
            </View>
          </View>

          <NavigationButtons 
            onBack={handleBack}
            onNext={handleNext}
            isNextDisabled={!selectedGender}
          />
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
  mainContent: {
    flex: 1,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#3498db',
    backgroundColor: '#ecf0f1',
  },
  selectedOptionText: {
    color: '#3498db',
    fontWeight: '600',
  },
});

export default GenderScreen;