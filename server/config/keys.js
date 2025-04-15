require('dotenv').config();

// Export environment variables safely
module.exports = {
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  googleCloud: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
  },
  // Add other API keys/secrets here
}; 