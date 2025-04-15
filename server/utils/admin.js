const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // If you're running in a production environment with a service account
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } 
  // For development, use application default credentials
  else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
}

// Export Firebase services
const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  storage,
  auth
}; 