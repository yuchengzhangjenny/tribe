import { 
  collection,
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  GeoPoint,
  Timestamp,
  startAfter,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { 
  EventDetails, 
  EventBasicInfo, 
  EventScreening, 
  EventAttendees,
  EventSearchParams 
} from '../types/event';

const EVENTS_COLLECTION = 'events';
const USERS_COLLECTION = 'users';

/**
 * Create a new event
 */
export const createEvent = async (
  organizerId: string, 
  eventData: Omit<EventBasicInfo, 'organizerId' | 'currentAttendees' | 'status'>
): Promise<string> => {
  try {
    // Format basic info with required fields
    const basicInfo: EventBasicInfo = {
      ...eventData,
      organizerId,
      currentAttendees: 0,
      status: 'active',
      public: eventData.public ?? true,
    };
    
    // Create a new event document
    const eventRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      basicInfo,
      screening: {
        autoApprove: true,
        questions: []
      },
      attendees: {
        approved: [organizerId], // Organizer is automatically an attendee
        pending: [],
        rejected: []
      },
      chatEnabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update user's organized events
    const userRef = doc(db, USERS_COLLECTION, organizerId);
    await updateDoc(userRef, {
      'eventInteractions.organized': arrayUnion(eventRef.id)
    });
    
    // Update attendee count
    await updateDoc(eventRef, {
      'basicInfo.currentAttendees': 1
    });
    
    return eventRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Get event details by ID
 */
export const getEventById = async (eventId: string): Promise<EventDetails | null> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return null;
    }
    
    const eventData = eventSnap.data();
    return {
      id: eventId,
      basicInfo: eventData.basicInfo,
      screening: eventData.screening,
      attendees: eventData.attendees,
      chatEnabled: eventData.chatEnabled,
      chatroomId: eventData.chatroomId
    } as EventDetails;
  } catch (error) {
    console.error(`Error getting event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Update event details
 */
export const updateEvent = async (
  eventId: string, 
  updates: Partial<EventDetails>
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    
    // Format the updates to match the document structure
    const formattedUpdates: Record<string, any> = {};
    
    if (updates.basicInfo) {
      Object.entries(updates.basicInfo).forEach(([key, value]) => {
        formattedUpdates[`basicInfo.${key}`] = value;
      });
    }
    
    if (updates.screening) {
      Object.entries(updates.screening).forEach(([key, value]) => {
        formattedUpdates[`screening.${key}`] = value;
      });
    }
    
    if (updates.chatEnabled !== undefined) {
      formattedUpdates.chatEnabled = updates.chatEnabled;
    }
    
    if (updates.chatroomId) {
      formattedUpdates.chatroomId = updates.chatroomId;
    }
    
    // Add update timestamp
    formattedUpdates.updatedAt = serverTimestamp();
    
    await updateDoc(eventRef, formattedUpdates);
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Cancel an event
 */
export const cancelEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      'basicInfo.status': 'cancelled',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error cancelling event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Request to join an event
 */
export const requestToJoinEvent = async (
  eventId: string, 
  userId: string, 
  answers: Record<string, string> = {}
): Promise<{ status: 'approved' | 'pending' }> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // Check if the event is full
    if (eventData.basicInfo.currentAttendees >= eventData.basicInfo.maxCapacity) {
      throw new Error('Event is at maximum capacity');
    }
    
    // Check if user is already approved or rejected
    if (eventData.attendees.approved.includes(userId)) {
      return { status: 'approved' };
    }
    
    if (eventData.attendees.rejected.includes(userId)) {
      throw new Error('Your request to join this event has been declined.');
    }
    
    // Check if auto-approval is enabled
    if (eventData.screening?.autoApprove) {
      // Approve the user immediately
      await updateDoc(eventRef, {
        'attendees.approved': arrayUnion(userId),
        'basicInfo.currentAttendees': eventData.basicInfo.currentAttendees + 1,
        updatedAt: serverTimestamp()
      });
      
      // Update user's attending events
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        'eventInteractions.attending': arrayUnion(eventId)
      });
      
      return { status: 'approved' };
    } else {
      // Add to pending requests
      const pendingRequest = {
        userId,
        answers,
        timestamp: new Date()
      };
      
      await updateDoc(eventRef, {
        'attendees.pending': arrayUnion(pendingRequest),
        updatedAt: serverTimestamp()
      });
      
      // Update user's pending requests
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        'eventInteractions.pendingRequests': arrayUnion(eventId)
      });
      
      return { status: 'pending' };
    }
  } catch (error) {
    console.error(`Error requesting to join event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Approve an attendee's request to join an event
 */
export const approveEventAttendee = async (
  eventId: string, 
  userId: string
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // Find the pending request
    const pendingRequests = eventData.attendees.pending || [];
    const pendingRequest = pendingRequests.find((req: any) => req.userId === userId);
    
    if (!pendingRequest) {
      throw new Error('No pending request found for this user');
    }
    
    // Remove from pending and add to approved
    await updateDoc(eventRef, {
      'attendees.pending': arrayRemove(pendingRequest),
      'attendees.approved': arrayUnion(userId),
      'basicInfo.currentAttendees': eventData.basicInfo.currentAttendees + 1,
      updatedAt: serverTimestamp()
    });
    
    // Update user's event interactions
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      'eventInteractions.pendingRequests': arrayRemove(eventId),
      'eventInteractions.attending': arrayUnion(eventId)
    });
  } catch (error) {
    console.error(`Error approving attendee for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Reject an attendee's request to join an event
 */
export const rejectEventAttendee = async (
  eventId: string, 
  userId: string
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // Find the pending request
    const pendingRequests = eventData.attendees.pending || [];
    const pendingRequest = pendingRequests.find((req: any) => req.userId === userId);
    
    if (!pendingRequest) {
      throw new Error('No pending request found for this user');
    }
    
    // Remove from pending and add to rejected
    await updateDoc(eventRef, {
      'attendees.pending': arrayRemove(pendingRequest),
      'attendees.rejected': arrayUnion(userId),
      updatedAt: serverTimestamp()
    });
    
    // Update user's event interactions
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      'eventInteractions.pendingRequests': arrayRemove(eventId),
      'eventInteractions.rejected': arrayUnion(eventId)
    });
  } catch (error) {
    console.error(`Error rejecting attendee for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Search for events based on parameters
 */
export const searchEvents = async (
  searchParams: EventSearchParams,
  lastEventDoc?: any,
  pageSize: number = 10
): Promise<{ events: EventDetails[], lastVisible: any }> => {
  try {
    let eventsQuery: any = collection(db, EVENTS_COLLECTION);
    
    // Build query based on search parameters
    const constraints: any[] = [];
    
    // Filter by active status by default
    constraints.push(where('basicInfo.status', '==', searchParams.status || 'active'));
    
    // Filter by organizer if specified
    if (searchParams.organizerId) {
      constraints.push(where('basicInfo.organizerId', '==', searchParams.organizerId));
    }
    
    // Filter by max attendees if specified
    if (searchParams.maxAttendees) {
      constraints.push(where('basicInfo.maxCapacity', '<=', searchParams.maxAttendees));
    }
    
    // Filter by date range if specified
    if (searchParams.dateRange) {
      constraints.push(where('basicInfo.dateTime', '>=', searchParams.dateRange.start));
      
      if (searchParams.dateRange.end) {
        constraints.push(where('basicInfo.dateTime', '<=', searchParams.dateRange.end));
      }
    }
    
    // Order by date
    constraints.push(orderBy('basicInfo.dateTime'));
    
    // Apply pagination
    constraints.push(limit(pageSize));
    
    // Apply starting point for pagination if provided
    if (lastEventDoc) {
      constraints.push(startAfter(lastEventDoc));
    }
    
    // Build the query with all constraints
    eventsQuery = query(eventsQuery, ...constraints);
    
    // Execute the query
    const querySnapshot = await getDocs(eventsQuery);
    
    // Extract the events
    const events: EventDetails[] = [];
    querySnapshot.forEach((doc: any) => {
      const eventData = doc.data();
      events.push({
        id: doc.id,
        basicInfo: eventData.basicInfo,
        screening: eventData.screening,
        attendees: eventData.attendees,
        chatEnabled: eventData.chatEnabled,
        chatroomId: eventData.chatroomId
      });
    });
    
    // Get the last visible document for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { events, lastVisible };
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

/**
 * Upload an event photo to Firebase Storage
 */
export const uploadEventPhoto = async (
  eventId: string, 
  imageUri: string
): Promise<string> => {
  try {
    // Create a reference to the profile image in Firebase Storage
    const storageRef = ref(storage, `events/${eventId}/photos/${Date.now()}`);
    
    // Fetch the image
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Add to event photos
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      'basicInfo.photos': arrayUnion(downloadURL)
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading event photo:', error);
    throw error;
  }
}; 