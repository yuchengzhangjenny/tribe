import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Types
export interface UserProfile {
  uid: string;
  basic_info: {
    displayName: string;
    email: string;
    photoURL: string | null;
    phoneNumber: string | null;
    createdAt: any; // Firestore timestamp
    lastActive: any; // Firestore timestamp
    isOnline: boolean;
  };
  profile: {
    age?: number;
    gender?: string;
    location?: {
      city: string;
      state: string;
      country: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    hometown?: string;
    occupation?: string;
    school?: string;
    mbti?: string;
    horoscope?: string;
    bio?: string;
    lookingFor?: string;
    hobbies?: string[];
    profileCompleteness: number;
    profileViewers?: string[];
    profileViewCount?: number;
  };
  stats: {
    daysOnApp: number;
    points: number;
    badges: string[];
    eventsAttended: number;
    eventsOrganized: number;
    connections: number;
  };
}

interface UsersState {
  currentProfile: UserProfile | null;
  profiles: Record<string, UserProfile>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  currentProfile: null,
  profiles: {},
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      return { uid: userId, ...userData } as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ userId, profileData }: { userId: string; profileData: Partial<UserProfile> }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, profileData);
      
      // Fetch the updated profile to ensure we're in sync
      const updatedDoc = await getDoc(userRef);
      const updatedData = updatedDoc.data();
      
      return { uid: userId, ...updatedData } as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async ({ query: searchQuery, limit = 20 }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      // This is a simple implementation that searches by displayName
      // In a real app, you might want to use a more sophisticated search
      // (e.g., Firebase Extensions like Algolia)
      const q = query(
        collection(db, 'users'),
        where('basic_info.displayName', '>=', searchQuery),
        where('basic_info.displayName', '<=', searchQuery + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users: Record<string, UserProfile> = {};
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users[doc.id] = { uid: doc.id, ...userData } as UserProfile;
      });
      
      return users;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = 'succeeded';
        state.profiles[action.payload.uid] = action.payload;
        if (action.payload.uid === state.currentProfile?.uid) {
          state.currentProfile = action.payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update user profile
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profiles[action.payload.uid] = action.payload;
        if (action.payload.uid === state.currentProfile?.uid) {
          state.currentProfile = action.payload;
        }
      })
      
      // Search users
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<Record<string, UserProfile>>) => {
        state.profiles = { ...state.profiles, ...action.payload };
      });
  },
});

export default usersSlice.reducer; 