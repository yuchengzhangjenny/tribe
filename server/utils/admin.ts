// NOTE: This file is only for server-side use (Node.js environments)
// DO NOT import this in client-side code (React Native)
import * as admin from 'firebase-admin';

// Initialize the app without a service account file
// Instead, use environment variables (this works with Firebase hosting and Cloud Functions)
if (!admin.apps.length) {
  admin.initializeApp({
    // When deployed to Firebase, these credentials are automatically available
    // For local development, you can set GOOGLE_APPLICATION_CREDENTIALS env variable
    // or use firebase emulators
  });
}

// Export admin services
export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;