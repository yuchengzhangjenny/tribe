import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  style?: object;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  style 
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <View style={[styles.progressContainer, style]}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{currentStep} of {totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProgressBar; 