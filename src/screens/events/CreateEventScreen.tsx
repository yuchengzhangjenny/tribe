import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AppTitle, AppBody, AppSubtitle, AppErrorText } from '../../components/common/AppText';

type Props = {
  navigation: any;
};

type FormData = {
  title: string;
  description: string;
  date: Date | null;
  time: Date | null;
  location: string;
  price: string;
  imageUri: string | null;
  tags: string[];
};

const initialFormData: FormData = {
  title: '',
  description: '',
  date: null,
  time: null,
  location: '',
  price: '',
  imageUri: null,
  tags: [],
};

const availableTags = [
  'Technology', 'Business', 'Networking', 'Education',
  'Workshop', 'Social', 'Fitness', 'Wellness',
  'Food', 'Outdoors', 'Arts', 'Music',
];

const CreateEventScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  
  const updateFormField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to upload an image.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormField('imageUri', result.assets[0].uri);
    }
  };
  
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  
  const handleDateConfirm = (date: Date) => {
    updateFormField('date', date);
    hideDatePicker();
  };
  
  const showTimePicker = () => {
    setTimePickerVisible(true);
  };
  
  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };
  
  const handleTimeConfirm = (time: Date) => {
    updateFormField('time', time);
    hideTimePicker();
  };
  
  const toggleTag = (tag: string) => {
    const currentTags = [...formData.tags];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex >= 0) {
      currentTags.splice(tagIndex, 1);
    } else {
      if (currentTags.length < 3) {
        currentTags.push(tag);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 3 tags');
        return;
      }
    }
    
    updateFormField('tags', currentTags);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (time: Date | null) => {
    if (!time) return '';
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.imageUri) {
      newErrors.imageUri = 'Event image is required';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Select at least one tag';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCreateEvent = () => {
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log('Creating event with data:', formData);
      
      // Show success message
      Alert.alert(
        'Success',
        'Your event has been created!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EventsList'),
          },
        ]
      );
    } else {
      // Scroll to the top to show errors
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <AppBody style={styles.cancelButton}>Cancel</AppBody>
          </TouchableOpacity>
          <AppTitle style={styles.headerTitle}>Create Event</AppTitle>
          <TouchableOpacity onPress={handleCreateEvent}>
            <AppBody style={styles.createButton}>Create</AppBody>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View style={styles.formSection}>
            <AppSubtitle style={styles.sectionTitle}>Event Details</AppSubtitle>
            
            <View style={styles.inputContainer}>
              <AppBody style={styles.inputLabel}>Title</AppBody>
              <TextInput
                style={[styles.textInput, errors.title && styles.inputError]}
                placeholder="Enter event title"
                value={formData.title}
                onChangeText={(text) => updateFormField('title', text)}
              />
              {errors.title && <AppErrorText>{errors.title}</AppErrorText>}
            </View>
            
            <View style={styles.inputContainer}>
              <AppBody style={styles.inputLabel}>Description</AppBody>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                placeholder="Describe your event"
                value={formData.description}
                onChangeText={(text) => updateFormField('description', text)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              {errors.description && <AppErrorText>{errors.description}</AppErrorText>}
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <AppBody style={styles.inputLabel}>Date</AppBody>
                <TouchableOpacity
                  style={[styles.pickerButton, errors.date && styles.inputError]}
                  onPress={showDatePicker}
                >
                  <AppBody>
                    {formData.date ? formatDate(formData.date) : 'Select date'}
                  </AppBody>
                </TouchableOpacity>
                {errors.date && <AppErrorText>{errors.date}</AppErrorText>}
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <AppBody style={styles.inputLabel}>Time</AppBody>
                <TouchableOpacity
                  style={[styles.pickerButton, errors.time && styles.inputError]}
                  onPress={showTimePicker}
                >
                  <AppBody>
                    {formData.time ? formatTime(formData.time) : 'Select time'}
                  </AppBody>
                </TouchableOpacity>
                {errors.time && <AppErrorText>{errors.time}</AppErrorText>}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <AppBody style={styles.inputLabel}>Location</AppBody>
              <TextInput
                style={[styles.textInput, errors.location && styles.inputError]}
                placeholder="Enter event location"
                value={formData.location}
                onChangeText={(text) => updateFormField('location', text)}
              />
              {errors.location && <AppErrorText>{errors.location}</AppErrorText>}
            </View>
            
            <View style={styles.inputContainer}>
              <AppBody style={styles.inputLabel}>Price</AppBody>
              <TextInput
                style={styles.textInput}
                placeholder="Free or enter amount"
                value={formData.price}
                onChangeText={(text) => updateFormField('price', text)}
                keyboardType="default"
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <AppSubtitle style={styles.sectionTitle}>Event Image</AppSubtitle>
            
            <TouchableOpacity
              style={[styles.imagePicker, errors.imageUri && styles.inputError]}
              onPress={handleImagePick}
            >
              {formData.imageUri ? (
                <Image source={{ uri: formData.imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <AppBody style={styles.placeholderText}>Tap to add an image</AppBody>
                  <AppBody style={styles.placeholderSubtext}>16:9 ratio recommended</AppBody>
                </View>
              )}
            </TouchableOpacity>
            {errors.imageUri && <AppErrorText>{errors.imageUri}</AppErrorText>}
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.tagsHeader}>
              <AppSubtitle style={styles.sectionTitle}>Event Tags</AppSubtitle>
              <AppBody style={styles.tagCounter}>{formData.tags.length}/3</AppBody>
            </View>
            
            <View style={styles.tagsContainer}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    formData.tags.includes(tag) && styles.selectedTagButton,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <AppBody
                    style={[
                      styles.tagButtonText,
                      formData.tags.includes(tag) && styles.selectedTagButtonText,
                    ]}
                  >
                    {tag}
                  </AppBody>
                </TouchableOpacity>
              ))}
            </View>
            {errors.tags && <AppErrorText>{errors.tags}</AppErrorText>}
          </View>
        </ScrollView>
        
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
        
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    marginBottom: 0,
  },
  cancelButton: {
    color: '#999',
    fontSize: 16,
  },
  createButton: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'left',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 100,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  inputRow: {
    flexDirection: 'row',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginBottom: 5,
  },
  placeholderSubtext: {
    color: '#999',
    fontSize: 12,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagCounter: {
    color: '#666',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  tagButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagButton: {
    backgroundColor: '#3498db',
  },
  tagButtonText: {
    fontSize: 14,
  },
  selectedTagButtonText: {
    color: 'white',
  },
});

export default CreateEventScreen; 