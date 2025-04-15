import { getStorage } from 'firebase/storage';
import { app } from './config';

// Initialize and export Firebase Storage
export const storage = getStorage(app); 