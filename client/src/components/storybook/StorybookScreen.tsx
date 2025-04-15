import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ButtonStorybook from './ButtonStorybook';

/**
 * Main storybook screen for browsing all component stories
 */
const StorybookScreen = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Simple component list without icons
  const renderComponentList = () => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>UI Component Library</Text>
          <Text style={styles.subtitle}>Tap a component to view its variants</Text>
        </View>

        <TouchableOpacity 
          style={styles.componentButton}
          onPress={() => setSelectedComponentId('button')}
        >
          <Text style={styles.componentButtonText}>Button Component</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render the selected component or component list
  if (selectedComponentId === 'button') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedComponentId(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Button Component</Text>
        </View>
        
        <ScrollView style={styles.contentContainer}>
          <ButtonStorybook />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderComponentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  componentButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3498db',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
});

export default StorybookScreen; 