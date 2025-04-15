import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 