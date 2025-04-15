import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase/auth';
import { firestore } from '../firebase/firestore';
import { storage } from '../firebase/storage';
import { UserProfile, UserStats, UserSettings } from '../types/user';

const USERS_COLLECTION = 'users';

// Type for registration data
export type RegistrationData = {
  dateOfBirth?: string;
  gender?: string;
  hometown?: string;
  currentLocation?: string;
  hobbies?: string[];
  profileImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  displayName?: string;
  email?: string;
  fullName?: string;
  usageReason?: string;
  profession?: string;
  school?: string;
};

/**
 * Save user profile data to Firestore
 */
export const saveUserProfile = async (userId: string, profileData: Partial<RegistrationData>): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      });
    }
  } catch (error: any) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const userData = userSnap.data();
    
    // Combine basic_info and profile data
    return {
      ...(userData.basic_info || {}),
      ...(userData.profile || {})
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Upload a profile image to Firebase Storage
 */
export const uploadProfileImage = async (userId: string, uri: string, index: number = 0): Promise<string> => {
  try {
    // Create a reference to the profile image in Firebase Storage
    const storageRef = ref(storage, `users/${userId}/profile-images/image-${index}`);
    
    // Fetch the image
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Create a new user profile with all required collections
 */
export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<string> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Set basic info
    await setDoc(userRef, {
      basic_info: {
        displayName: profileData.displayName || '',
        email: profileData.email || '',
        photoURL: profileData.photoURL || null,
        phoneNumber: profileData.phoneNumber || null,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        isOnline: true
      }
    }, { merge: true });
    
    // Calculate profile completeness
    const profileCompleteness = calculateProfileCompleteness(profileData);
    
    // Set profile data
    await setDoc(userRef, {
      profile: {
        ...profileData,
        // Ensure profileCompleteness is at least 1 to indicate registration is complete
        profileCompleteness: Math.max(profileCompleteness, 1),
        profileViewers: [],
        profileViewCount: 0
      }
    }, { merge: true });
    
    // Initialize stats
    await setDoc(userRef, {
      stats: {
        daysOnApp: 0,
        points: 0,
        badges: [],
        eventsAttended: 0,
        eventsOrganized: 0,
        connections: 0
      }
    }, { merge: true });
    
    // Initialize default settings
    await setDoc(userRef, {
      settings: {
        notificationPreferences: {
          pushEnabled: true,
          emailEnabled: true,
          eventReminders: true,
          newMessages: true,
          connectionRequests: true
        },
        privacySettings: {
          profileVisibility: 'public',
          showLocation: true,
          showActivity: true
        },
        theme: 'light'
      }
    }, { merge: true });
    
    return userId;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Update user profile fields
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    const userRef = doc(firestore, 'users', userId);
    
    // Update profile and recalculate completeness
    const updatedProfile = { ...profile, ...updates };
    const profileCompleteness = calculateProfileCompleteness(updatedProfile);
    
    // Update profile fields
    await setDoc(userRef, {
      profile: {
        ...updates,
        profileCompleteness
      }
    }, { merge: true });
    
    // Update last active timestamp
    await updateDoc(userRef, {
      'basic_info.lastActive': serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get user stats
 */
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data().stats as UserStats || null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data().settings as UserSettings || null;
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

/**
 * Update user settings
 */
export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    await setDoc(userRef, {
      settings: settings
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Helper function to calculate profile completeness
 */
const calculateProfileCompleteness = (profile: Partial<UserProfile>): number => {
  const fields = [
    'displayName',
    'email',
    'photoURL',
    'age',
    'gender',
    'location',
    'hometown',
    'occupation',
    'school',
    'bio',
    'hobbies'
  ];
  
  const filledFields = fields.filter(field => {
    const value = profile[field as keyof UserProfile];
    return value !== undefined && value !== null && value !== '';
  }).length;
  
  return Math.round((filledFields / fields.length) * 100);
}; 