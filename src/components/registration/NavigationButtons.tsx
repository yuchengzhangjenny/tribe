import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  showBackButton?: boolean;
  style?: object;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  isNextDisabled = false,
  showBackButton = true,
  style
}) => {
  return (
    <View style={[styles.buttonContainer, style]}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          disabled={!onBack}
        >
          <Text style={styles.backButtonText}>{backLabel}</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[
          styles.nextButton, 
          isNextDisabled && styles.disabledButton,
          !showBackButton && styles.fullWidthButton
        ]}
        onPress={onNext}
        disabled={isNextDisabled}
      >
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  fullWidthButton: {
    marginLeft: 0,
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

export default NavigationButtons; 