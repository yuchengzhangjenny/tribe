// For Expo/React Native environment variables
import Constants from 'expo-constants';

// Access variables from app.json or environment variables
const ENV = {
  dev: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.googleMapsApiKey,
    apiUrl: 'http://localhost:3000/api',
  },
  staging: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.googleMapsApiKey,
    apiUrl: 'https://staging-api.yourdomain.com/api',
  },
  prod: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.googleMapsApiKey,
    apiUrl: 'https://api.yourdomain.com/api',
  }
};

// Determine which environment to use
const getEnvVars = (env = process.env.NODE_ENV || 'development') => {
  if (env === 'production') {
    return ENV.prod;
  } else if (env === 'staging') {
    return ENV.staging;
  } else {
    return ENV.dev;
  }
};

export default getEnvVars(); 