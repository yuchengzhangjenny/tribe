import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy as fsOrderBy,
  QueryConstraint
} from 'firebase/firestore';
import { app } from './config';

// Initialize and export Firestore
export const firestore = getFirestore(app);

// Common database operations using Firebase v9 modular API
export const db = {
  // Get a document by ID
  async getDoc<T>(collectionPath: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(firestore, collectionPath, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() } as T;
    } catch (error) {
      console.error(`Error getting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },
  
  // Create or update a document
  async setDoc(collectionPath: string, id: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = doc(firestore, collectionPath, id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`Error setting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },
  
  // Add a new document with auto-generated ID
  async addDoc(collectionPath: string, data: Record<string, any>): Promise<string> {
    try {
      const collectionRef = collection(firestore, collectionPath);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionPath}:`, error);
      throw error;
    }
  },
  
  // Update specific fields on a document
  async updateDoc(collectionPath: string, id: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = doc(firestore, collectionPath, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },
  
  // Delete a document
  async deleteDoc(collectionPath: string, id: string): Promise<void> {
    try {
      const docRef = doc(firestore, collectionPath, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },
  
  // Get collection with query
  async getCollection<T>(
    collectionPath: string, 
    queries: Array<{field: string, operator: string, value: any}> = [],
    orderBy?: {field: string, direction: 'asc' | 'desc'}
  ): Promise<T[]> {
    try {
      const collectionRef = collection(firestore, collectionPath);
      
      // Build query constraints
      const queryConstraints: QueryConstraint[] = queries.map(q => 
        where(q.field, q.operator as any, q.value)
      );
      
      // Add ordering if specified
      if (orderBy) {
        queryConstraints.push(fsOrderBy(orderBy.field, orderBy.direction));
      }
      
      // Create and execute query
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Map documents to array of objects
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
    } catch (error) {
      console.error(`Error getting collection ${collectionPath}:`, error);
      throw error;
    }
  }
};