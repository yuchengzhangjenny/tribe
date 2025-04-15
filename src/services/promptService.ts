import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Prompt, UserPrompt, Comment } from '../store/promptsSlice';

// Fetch all available prompts
export const fetchAvailablePrompts = async (): Promise<Prompt[]> => {
  try {
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
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

// Fetch user's selected prompts
export const fetchUserPrompts = async (userId: string): Promise<UserPrompt[]> => {
  try {
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
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    throw error;
  }
};

// Add a prompt to user's profile
export const addPromptToProfile = async (
  userId: string, 
  promptId: string, 
  answer: string
): Promise<UserPrompt> => {
  try {
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
    
    // Get the prompt data
    const promptRef = doc(db, 'prompts', promptId);
    const promptSnap = await getDoc(promptRef);
    
    if (!promptSnap.exists()) {
      throw new Error('Prompt not found');
    }
    
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
  } catch (error) {
    console.error('Error adding prompt to profile:', error);
    throw error;
  }
};

// Update a user prompt answer
export const updateUserPrompt = async (
  userId: string, 
  userPromptId: string, 
  answer: string
): Promise<void> => {
  try {
    const userPromptRef = doc(db, `users/${userId}/userPrompts`, userPromptId);
    
    await updateDoc(userPromptRef, {
      answer,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user prompt:', error);
    throw error;
  }
};

// Delete a user prompt
export const deleteUserPrompt = async (
  userId: string, 
  userPromptId: string
): Promise<void> => {
  try {
    const userPromptRef = doc(db, `users/${userId}/userPrompts`, userPromptId);
    await deleteDoc(userPromptRef);
  } catch (error) {
    console.error('Error deleting user prompt:', error);
    throw error;
  }
};

// Reorder user prompts
export const reorderUserPrompts = async (
  userId: string, 
  reorderedPrompts: UserPrompt[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    reorderedPrompts.forEach((prompt, index) => {
      const promptRef = doc(db, `users/${userId}/userPrompts`, prompt.id);
      batch.update(promptRef, { displayOrder: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering prompts:', error);
    throw error;
  }
};

// Add like to a user prompt
export const likeUserPrompt = async (
  userId: string, 
  targetUserId: string, 
  userPromptId: string
): Promise<void> => {
  try {
    const promptRef = doc(db, `users/${targetUserId}/userPrompts`, userPromptId);
    const promptSnap = await getDoc(promptRef);
    
    if (!promptSnap.exists()) {
      throw new Error('Prompt not found');
    }
    
    const promptData = promptSnap.data();
    const likes = promptData.likes || [];
    
    // Check if user already liked
    if (likes.includes(userId)) {
      // Remove like
      await updateDoc(promptRef, {
        likes: arrayRemove(userId)
      });
    } else {
      // Add like
      await updateDoc(promptRef, {
        likes: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error('Error liking user prompt:', error);
    throw error;
  }
};

// Add comment to a user prompt
export const commentOnUserPrompt = async (
  userId: string, 
  targetUserId: string, 
  userPromptId: string, 
  commentText: string
): Promise<Comment> => {
  try {
    const promptRef = doc(db, `users/${targetUserId}/userPrompts`, userPromptId);
    
    const newComment = {
      userId,
      text: commentText,
      timestamp: new Date()
    };
    
    await updateDoc(promptRef, {
      comments: arrayUnion(newComment)
    });
    
    return newComment;
  } catch (error) {
    console.error('Error commenting on user prompt:', error);
    throw error;
  }
}; 