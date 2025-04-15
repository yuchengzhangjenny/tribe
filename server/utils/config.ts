import { initializeApp, getApps } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "tribe-62e2d.firebaseapp.com",
  projectId: "tribe-62e2d",
  storageBucket: "tribe-62e2d.firebasestorage.app",
  messagingSenderId: "179220259612",
  appId: "1:179220259612:web:a2498cfb7ac72de25250d9",
  measurementId: "G-2CCXN8JX8T"
};

// Initialize Firebase only if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export { app }; 

