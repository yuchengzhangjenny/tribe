import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView
} from 'react-native';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>Tribe</Text>
        <ActivityIndicator size="large" color="#3498db" style={styles.spinner} />
        <Text style={styles.loadingText}>Loading...</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3498db',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingScreen; 