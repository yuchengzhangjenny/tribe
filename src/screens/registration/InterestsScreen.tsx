import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

// Define a list of potential interests/hobbies
const allInterests = [
  'Photography', 'Hiking', 'Travel', 'Cooking', 'Fitness',
  'Reading', 'Writing', 'Music', 'Dancing', 'Painting',
  'Fashion', 'Technology', 'Sports', 'Movies', 'Gaming',
  'Yoga', 'Meditation', 'Entrepreneurship', 'Design', 'Food',
  'Coffee', 'Wine', 'Nature', 'Animals', 'Volunteering'
];

const HobbiesScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    registrationData.hobbies || []
  );
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interest)) {
        return prevSelected.filter(item => item !== interest);
      } else {
        // Limit to maximum 5 interests
        if (prevSelected.length >= 5) {
          setError('You can select up to 5 interests');
          return prevSelected;
        }
        setError('');
        return [...prevSelected, interest];
      }
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      setError('Please select at least 3 interests');
      return;
    }

    updateRegistrationData({ hobbies: selectedInterests });
    navigation.navigate('ProfilePicture');
  };

  const renderInterestItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.interestItem,
        selectedInterests.includes(item) && styles.selectedInterest,
      ]}
      onPress={() => toggleInterest(item)}
    >
      <Text
        style={[
          styles.interestText,
          selectedInterests.includes(item) && styles.selectedInterestText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>5 of 10</Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title}>What are you interested in?</Text>
            <Text style={styles.subtitle}>
              Select 3-5 interests to help us connect you with like-minded people
            </Text>

            <View style={styles.selectionInfo}>
              <Text style={styles.selectionCount}>
                {selectedInterests.length} of 5 selected
              </Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <FlatList
              data={allInterests}
              renderItem={renderInterestItem}
              keyExtractor={(item) => item}
              numColumns={2}
              contentContainerStyle={styles.interestList}
              columnWrapperStyle={styles.row}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.nextButton,
                selectedInterests.length < 3 && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={selectedInterests.length < 3}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectionCount: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  interestList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  interestItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    width: '48%',
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#e6f2ff',
    borderColor: '#3498db',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInterestText: {
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

export default HobbiesScreen; 