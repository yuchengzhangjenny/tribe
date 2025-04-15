import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegistration } from '../../contexts/RegistrationContext';

type Props = {
  navigation: any;
};

const HobbiesScreen: React.FC<Props> = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(registrationData.hobbies || []);
  const [searchQuery, setSearchQuery] = useState('');
  
  // List of hobby suggestions
  const hobbySuggestions = [
    'Photography', 'Cooking', 'Hiking', 'Reading', 
    'Painting', 'Gaming', 'Yoga', 'Running', 
    'Dancing', 'Traveling', 'Gardening', 'Movies',
    'Music', 'Swimming', 'Cycling', 'Writing',
    'Meditation', 'Fashion', 'Singing', 'Coding',
    'Board Games', 'Tennis', 'Basketball', 'Soccer',
    'Wine Tasting', 'Camping', 'Fishing', 'Pottery',
  ];

  const filteredHobbies = searchQuery
    ? hobbySuggestions.filter(hobby => 
        hobby.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hobbySuggestions;

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      // Remove hobby if it's already selected
      const updatedHobbies = selectedHobbies.filter(h => h !== hobby);
      setSelectedHobbies(updatedHobbies);
      updateRegistrationData({ hobbies: updatedHobbies });
    } else {
      // Add hobby if it's not already selected (max 5)
      if (selectedHobbies.length < 5) {
        const updatedHobbies = [...selectedHobbies, hobby];
        setSelectedHobbies(updatedHobbies);
        updateRegistrationData({ hobbies: updatedHobbies });
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 hobbies.');
      }
    }
  };

  const handleNext = () => {
    if (selectedHobbies.length === 0) {
      Alert.alert(
        'No Hobbies Selected',
        'Are you sure you want to proceed without selecting any hobbies?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              console.log('Continuing without hobbies');
              navigation.navigate('RegistrationComplete');
            },
          },
        ]
      );
      return;
    }
    
    // Store selected hobbies and navigate to next screen
    console.log('Selected hobbies:', selectedHobbies);
    navigation.navigate('RegistrationComplete');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>11 of 11</Text>
        </View>

        <ScrollView style={styles.mainContent}>
          <Text style={styles.title}>What are your interests?</Text>
          <Text style={styles.subtitle}>
            Select up to 5 hobbies to help us connect you with like-minded people
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for hobbies"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.selectedHobbiesContainer}>
            {selectedHobbies.length > 0 ? (
              <View style={styles.hobbyChipContainer}>
                {selectedHobbies.map(hobby => (
                  <View key={hobby} style={styles.hobbyChip}>
                    <Text style={styles.hobbyChipText}>{hobby}</Text>
                    <TouchableOpacity 
                      onPress={() => toggleHobby(hobby)}
                      style={styles.removeHobbyButton}
                    >
                      <Ionicons name="close-circle" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noHobbiesText}>
                No hobbies selected yet
              </Text>
            )}
          </View>

          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <View style={styles.suggestionsContainer}>
            {filteredHobbies.map(hobby => (
              <TouchableOpacity
                key={hobby}
                style={[
                  styles.suggestionItem,
                  selectedHobbies.includes(hobby) && styles.selectedSuggestion,
                ]}
                onPress={() => toggleHobby(hobby)}
              >
                <Text style={[
                  styles.suggestionText,
                  selectedHobbies.includes(hobby) && styles.selectedSuggestionText,
                ]}>
                  {hobby}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
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
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  selectedHobbiesContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    minHeight: 80,
  },
  hobbyChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobbyChip: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  hobbyChipText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  removeHobbyButton: {
    padding: 2,
  },
  noHobbiesText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  suggestionItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  selectedSuggestion: {
    backgroundColor: '#e1f0ff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  suggestionText: {
    color: '#333',
    fontSize: 14,
  },
  selectedSuggestionText: {
    color: '#3498db',
    fontWeight: '500',
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

export default HobbiesScreen;