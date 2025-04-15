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
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

type UsageReasonOption = 'meet-new-people' | 'networking' | 'find-events' | 'find-community' | 'other';

const usageReasons = [
  { value: 'meet-new-people', label: 'Meet new people' },
  { value: 'networking', label: 'Networking' },
  { value: 'find-events', label: 'Find local events' },
  { value: 'find-community', label: 'Find my community' },
  { value: 'other', label: 'Other' },
];

const PurposeScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedReason, setSelectedReason] = useState<UsageReasonOption | null>(
    registrationData.usageReason as UsageReasonOption || null
  );

  const handleReasonSelect = (reason: UsageReasonOption) => {
    setSelectedReason(reason);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedReason) return;
    
    updateRegistrationData({ usageReason: selectedReason });
    navigation.navigate('Profession');
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
              <View style={[styles.progress, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>7 of 10</Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title}>Why are you here?</Text>
            <Text style={styles.subtitle}>
              Let us know your primary reason for using our app
            </Text>

            <View style={styles.optionsContainer}>
              {usageReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  style={[
                    styles.optionButton,
                    selectedReason === reason.value && styles.selectedOption,
                  ]}
                  onPress={() => handleReasonSelect(reason.value as UsageReasonOption)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedReason === reason.value && styles.selectedOptionText,
                    ]}
                  >
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.nextButton, !selectedReason && styles.disabledButton]}
              onPress={handleNext}
              disabled={!selectedReason}
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
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#3498db',
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
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PurposeScreen; 