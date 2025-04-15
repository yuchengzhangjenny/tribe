import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
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

const PreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  
  // Form state
  const [fullName, setFullName] = useState(registrationData.fullName || '');
  const [selectedReason, setSelectedReason] = useState(registrationData.usageReason || '');
  const [profession, setProfession] = useState(registrationData.profession || '');
  const [school, setSchool] = useState(registrationData.school || '');

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleNext = () => {
    if (!fullName.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name');
      return;
    }
    
    if (!selectedReason) {
      Alert.alert('Missing Information', 'Please select why you want to use Tribe');
      return;
    }
    
    // Update registration data with new fields
    updateRegistrationData({
      fullName,
      usageReason: selectedReason,
      profession,
      school,
    });
    
    // Navigate to next screen in registration flow
    navigation.navigate('ProfilePicture');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '63%' }]} />
          </View>
          <Text style={styles.progressText}>5 of 8</Text>
        </View>

        <ScrollView style={styles.mainContent}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <Text style={styles.subtitle}>
            Help us personalize your experience on Tribe
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Why are you using Tribe?</Text>
              <View style={styles.reasonsContainer}>
                {usageReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonButton,
                      selectedReason === reason && styles.selectedReasonButton,
                    ]}
                    onPress={() => handleReasonSelect(reason)}
                  >
                    <Text
                      style={[
                        styles.reasonText,
                        selectedReason === reason && styles.selectedReasonText,
                      ]}
                    >
                      {reason}
                    </Text>
                    {selectedReason === reason && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#3498db"
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profession (Optional)</Text>
              <TextInput
                style={styles.input}
                value={profession}
                onChangeText={setProfession}
                placeholder="What do you do for work?"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>School (Optional)</Text>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={setSchool}
                placeholder="Where do you go to school?"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  reasonsContainer: {
    marginTop: 5,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedReasonButton: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedReasonText: {
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
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreferencesScreen;