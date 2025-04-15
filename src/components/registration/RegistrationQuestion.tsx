import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppTitle, AppSubtitle } from '../common/AppText';

interface RegistrationQuestionProps {
  title: string;
  description: string;
  style?: object;
}

const RegistrationQuestion: React.FC<RegistrationQuestionProps> = ({
  title,
  description,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <AppTitle>{title}</AppTitle>
      <AppSubtitle>{description}</AppSubtitle>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default RegistrationQuestion; 