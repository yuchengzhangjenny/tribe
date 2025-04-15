import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, updateDoc, deleteDoc, writeBatch, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../services/firebase';

// Types
export interface Prompt {
  id: string;
  text: string;
  category?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface UserPrompt {
  id: string;
  promptId: string;
  promptText: string;
  answer: string;
  isVisible: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  likes: string[]; // Array of user IDs
  comments: Comment[];
}

export interface Comment {
  userId: string;
  text: string;
  timestamp: Date;
}

interface PromptsState {
  availablePrompts: Prompt[];
  userPrompts: UserPrompt[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: PromptsState = {
  availablePrompts: [],
  userPrompts: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchAvailablePrompts = createAsyncThunk(
  'prompts/fetchAvailable',
  async () => {
    const q = query(
      collection(db, 'prompts'),
      where('isActive', '==', true),
      orderBy('displayOrder')
    );
    
    const querySnapshot = await getDocs(q);
    const prompts: Prompt[] = [];
    
    querySnapshot.forEach((doc) => {
      prompts.push({
        id: doc.id,
        ...(doc.data() as Omit<Prompt, 'id'>)
      });
    });
    
    return prompts;
  }
);

export const fetchUserPrompts = createAsyncThunk(
  'prompts/fetchUserPrompts',
  async (userId: string) => {
    const q = query(
      collection(db, `users/${userId}/userPrompts`),
      orderBy('displayOrder')
    );
    
    const querySnapshot = await getDocs(q);
    const userPrompts: UserPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      userPrompts.push({
        id: doc.id,
        ...(doc.data() as Omit<UserPrompt, 'id'>)
      });
    });
    
    return userPrompts;
  }
);

export const addPromptToProfile = createAsyncThunk(
  'prompts/addPromptToProfile',
  async ({ userId, promptId, answer }: { userId: string; promptId: string; answer: string }) => {
    // Get the prompt data
    const promptRef = doc(db, 'prompts', promptId);
    const promptSnap = await getDoc(promptRef);
    
    if (!promptSnap.exists()) {
      throw new Error('Prompt not found');
    }
    
    const timestamp = new Date();
    
    // Find the highest current display order
    const userPromptsRef = collection(db, `users/${userId}/userPrompts`);
    const userPromptsSnapshot = await getDocs(userPromptsRef);
    
    let maxOrder = 0;
    userPromptsSnapshot.forEach((doc) => {
      const displayOrder = doc.data().displayOrder || 0;
      if (displayOrder > maxOrder) {
        maxOrder = displayOrder;
      }
    });
    
    // Create the new user prompt
    const newUserPrompt = {
      promptId,
      promptText: promptSnap.data().text,
      answer,
      isVisible: true,
      displayOrder: maxOrder + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      likes: [],
      comments: []
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, `users/${userId}/userPrompts`), newUserPrompt);
    
    return {
      id: docRef.id,
      ...newUserPrompt,
    };
  }
);

export const updateUserPrompt = createAsyncThunk(
  'prompts/updateUserPrompt',
  async ({ userId, userPromptId, answer }: { userId: string; userPromptId: string; answer: string }) => {
    const userPromptRef = doc(db, `users/${userId}/userPrompts`, userPromptId);
    
    await updateDoc(userPromptRef, {
      answer,
      updatedAt: new Date()
    });
    
    return { userPromptId, answer, updatedAt: new Date() };
  }
);

export const deleteUserPrompt = createAsyncThunk(
  'prompts/deleteUserPrompt',
  async ({ userId, userPromptId }: { userId: string; userPromptId: string }) => {
    const userPromptRef = doc(db, `users/${userId}/userPrompts`, userPromptId);
    await deleteDoc(userPromptRef);
    return userPromptId;
  }
);

export const reorderUserPrompts = createAsyncThunk(
  'prompts/reorderUserPrompts',
  async ({ userId, reorderedPrompts }: { userId: string; reorderedPrompts: UserPrompt[] }) => {
    const batch = writeBatch(db);
    
    reorderedPrompts.forEach((prompt, index) => {
      const promptRef = doc(db, `users/${userId}/userPrompts`, prompt.id);
      batch.update(promptRef, { displayOrder: index });
    });
    
    await batch.commit();
    return reorderedPrompts;
  }
);

// Slice
const promptsSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch available prompts
      .addCase(fetchAvailablePrompts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailablePrompts.fulfilled, (state, action: PayloadAction<Prompt[]>) => {
        state.status = 'succeeded';
        state.availablePrompts = action.payload;
      })
      .addCase(fetchAvailablePrompts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch prompts';
      })
      
      // Fetch user prompts
      .addCase(fetchUserPrompts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPrompts.fulfilled, (state, action: PayloadAction<UserPrompt[]>) => {
        state.status = 'succeeded';
        state.userPrompts = action.payload;
      })
      .addCase(fetchUserPrompts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user prompts';
      })
      
      // Add prompt to profile
      .addCase(addPromptToProfile.fulfilled, (state, action: PayloadAction<UserPrompt>) => {
        state.userPrompts.push(action.payload);
      })
      
      // Update user prompt
      .addCase(updateUserPrompt.fulfilled, (state, action) => {
        const index = state.userPrompts.findIndex(
          prompt => prompt.id === action.payload.userPromptId
        );
        if (index !== -1) {
          state.userPrompts[index].answer = action.payload.answer;
          state.userPrompts[index].updatedAt = action.payload.updatedAt;
        }
      })
      
      // Delete user prompt
      .addCase(deleteUserPrompt.fulfilled, (state, action) => {
        state.userPrompts = state.userPrompts.filter(
          prompt => prompt.id !== action.payload
        );
      })
      
      // Reorder user prompts
      .addCase(reorderUserPrompts.fulfilled, (state, action) => {
        state.userPrompts = action.payload.map((prompt, index) => ({
          ...prompt,
          displayOrder: index
        }));
      });
  },
});

export default promptsSlice.reducer; 