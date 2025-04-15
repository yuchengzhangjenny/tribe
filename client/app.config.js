require('dotenv').config();

export default {
  expo: {
    name: "Tribe",
    slug: "tribe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.tribe"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.tribe"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Safe to commit placeholder that will be replaced by actual values
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      googleCloudApiKey: process.env.GOOGLE_CLOUD_API_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    }
  }
}; 