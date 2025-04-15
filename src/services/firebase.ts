// This file is deprecated. Please use the firebase modules in /src/firebase instead.
import { app } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Re-export existing initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add a warning log to indicate this file should be deprecated
console.warn('src/services/firebase.ts is deprecated. Please update imports to use the firebase modules in /src/firebase instead.');

export default app; 