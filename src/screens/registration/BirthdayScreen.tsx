import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

const DateOfBirthScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [birthday, setBirthday] = useState<Date | null>(
    registrationData.dateOfBirth ? new Date(registrationData.dateOfBirth) : null
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [error, setError] = useState('');

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    // Check if user is at least 18 years old
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    if (date > eighteenYearsAgo) {
      setError('You must be at least 18 years old to use this app');
    } else {
      setError('');
      setBirthday(date);
    }
    
    hideDatePicker();
  };

  const formatBirthday = (date: Date) => {
    if (!date) return '';
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!birthday) {
      setError('Please select your date of birth');
      return;
    }

    updateRegistrationData({ dateOfBirth: birthday.toISOString() });
    navigation.navigate('Hobbies');
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
              <View style={[styles.progress, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>4 of 10</Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title}>When's your birthday?</Text>
            <Text style={styles.subtitle}>
              You must be at least 18 years old to use this app
            </Text>

            <TouchableOpacity
              style={[styles.birthdayButton, error && styles.inputError]}
              onPress={showDatePicker}
            >
              <Text style={[styles.birthdayText, !birthday && styles.placeholder]}>
                {birthday ? formatBirthday(birthday) : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={birthday || new Date(1990, 0, 1)}
              maximumDate={new Date()}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.nextButton, !birthday && styles.disabledButton]}
              onPress={handleNext}
              disabled={!birthday}
            >
              <Text style={styles.nextButtonText}>Next</Text>
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
  birthdayButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  birthdayText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
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
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DateOfBirthScreen; 