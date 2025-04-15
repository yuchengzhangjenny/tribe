import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

// Tribe usage reasons
const usageReasons = [
  'Find new experiences',
  'Build new skills with others',
  'Find new friends',
  'Find experiences with friends',
];

const PurposeScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedReason, setSelectedReason] = useState(registrationData.usageReason || '');

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleNext = () => {
    if (!selectedReason) {
      return; // Disable next button if no selection
    }
    
    // Update registration data with selection
    updateRegistrationData({ usageReason: selectedReason });
    console.log('Usage reason:', selectedReason);
    navigation.navigate('ProfilePicture');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '90%' }]} />
          </View>
          <Text style={styles.progressText}>9 of 10</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>What Are You Looking For?</Text>
          <Text style={styles.subtitle}>
            Tell us why you're joining Tribe
          </Text>

          <ScrollView contentContainerStyle={styles.optionsContainer}>
            {usageReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.optionButton,
                  selectedReason === reason && styles.selectedOption,
                ]}
                onPress={() => handleReasonSelect(reason)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedReason === reason && styles.selectedOptionText,
                  ]}
                >
                  {reason}
                </Text>
                {selectedReason === reason && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#3498db"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
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
    paddingBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedOption: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#3498db',
  },
  checkIcon: {
    marginLeft: 10,
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