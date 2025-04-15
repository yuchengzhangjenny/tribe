import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRegistration } from '../../contexts/RegistrationContext';
import ProgressBar from '../../components/registration/ProgressBar';
import NavigationButtons from '../../components/registration/NavigationButtons';
import RegistrationQuestion from '../../components/registration/RegistrationQuestion';
import { AppBody } from '../../components/common/AppText';

type Props = {
  navigation: any;
};

const DateOfBirthScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [date, setDate] = useState<Date>(() => {
    // Initialize with saved date if available
    if (registrationData.dateOfBirth) {
      return new Date(registrationData.dateOfBirth);
    }
    return new Date(2000, 0, 1);
  });
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState<string | null>(null);
  
  // Calculate minimum age (18 years ago)
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!date) {
      setError('Please select your date of birth');
      return;
    }

    // Validate age
    if (date > minAgeDate) {
      Alert.alert('Age Restriction', 'You must be at least 18 years old to register.');
      return;
    }
    
    // Store date of birth and navigate to next screen
    updateRegistrationData({ dateOfBirth: date.toISOString() });
    navigation.navigate('Hometown');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ProgressBar currentStep={4} totalSteps={10} />

          <View style={styles.mainContent}>
            <RegistrationQuestion 
              title="When were you born?" 
              description="We need to know your age to customize your experience" 
            />

            {Platform.OS === 'android' && (
              <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
                <AppBody>
                  {date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </AppBody>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePicker}
              />
            )}
          </View>

          <NavigationButtons 
            onBack={handleBack}
            onNext={handleNext}
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
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  datePicker: {
    width: Platform.OS === 'ios' ? '100%' : 'auto',
    marginTop: 20,
  },
});

export default DateOfBirthScreen;