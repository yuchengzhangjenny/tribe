import { getAuth } from 'firebase/auth';
import { app } from './config';

// Initialize and export Firebase Auth
export const auth = getAuth(app);