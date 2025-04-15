import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// Helper function to convert Firebase user to our User type
const formatUser = (user: FirebaseUser): User => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Store user data in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const timestamp = serverTimestamp();
      
      await setDoc(userRef, {
        basic_info: {
          displayName,
          email,
          photoURL: null,
          phoneNumber: null,
          createdAt: timestamp,
          lastActive: timestamp,
          isOnline: true,
        },
        profile: {
          profileCompleteness: 0,
        },
        stats: {
          daysOnApp: 0,
          points: 0,
          badges: [],
          eventsAttended: 0,
          eventsOrganized: 0,
          connections: 0,
        },
        settings: {
          notificationPreferences: {
            events: true,
            messages: true,
            connections: true,
          },
          privacySettings: {
            publicProfile: true,
          },
          theme: 'light',
        }
      });
      
      return formatUser(userCredential.user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last active
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        basic_info: {
          lastActive: serverTimestamp(),
          isOnline: true,
        }
      }, { merge: true });
      
      return formatUser(userCredential.user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      
      // Update online status if user exists
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          basic_info: {
            lastActive: serverTimestamp(),
            isOnline: false,
          }
        }, { merge: true });
      }
      
      await firebaseSignOut(auth);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload as string;
      })

      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer; 