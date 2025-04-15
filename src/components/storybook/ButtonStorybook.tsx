import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Button from '../common/Button';

/**
 * Simplified Storybook component for Button
 */
const ButtonStorybook = () => {
  // Mock handler for button presses
  const handlePress = () => {
    console.log('Button pressed');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Buttons</Text>
        <Button 
          title="Primary Button" 
          onPress={handlePress} 
          variant="primary" 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Secondary Button" 
          onPress={handlePress} 
          variant="secondary" 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Outline Button" 
          onPress={handlePress} 
          variant="outline" 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Text Button" 
          onPress={handlePress} 
          variant="text" 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Sizes</Text>
        <Button 
          title="Small Button" 
          onPress={handlePress} 
          size="small" 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Medium Button" 
          onPress={handlePress} 
          size="medium" 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Large Button" 
          onPress={handlePress} 
          size="large" 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button States</Text>
        <Button 
          title="Disabled Button" 
          onPress={handlePress} 
          disabled 
        />
        
        <View style={styles.spacing} />
        
        <Button 
          title="Loading Button" 
          onPress={handlePress} 
          loading 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Width Button</Text>
        <Button 
          title="Full Width Button" 
          onPress={handlePress} 
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  spacing: {
    height: 12,
  },
});

export default ButtonStorybook; 