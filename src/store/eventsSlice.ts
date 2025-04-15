import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc,
  deleteDoc,
  GeoPoint, 
  serverTimestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Types
export interface Event {
  id: string;
  basic_info: {
    title: string;
    description: string;
    type: string;
    tags: string[];
    createdAt: any; // Firestore timestamp
    organizerId: string;
    dateTime: any; // Firestore timestamp
    location: {
      latitude: number;
      longitude: number;
    };
    address: string;
    maxCapacity: number;
    currentAttendees: number;
    status: 'active' | 'cancelled' | 'completed';
    photos: string[];
    public: boolean;
  };
  screening?: {
    questions: Array<{
      question: string;
      required: boolean;
    }>;
    autoApprove: boolean;
  };
  attendees: {
    approved: string[]; // Array of user IDs
    pending: Array<{
      userId: string;
      answers: Record<string, string>;
      timestamp: any; // Firestore timestamp
    }>;
    rejected: string[]; // Array of user IDs
  };
  chat?: {
    chatroomId: string;
    enabled: boolean;
  };
}

interface EventsState {
  events: Record<string, Event>;
  filteredEvents: string[]; // Array of event IDs
  selectedEvent: Event | null;
  nearbyEvents: string[]; // Array of event IDs
  userEvents: {
    attending: string[]; // Array of event IDs
    organizing: string[]; // Array of event IDs
    interested: string[]; // Array of event IDs
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: EventsState = {
  events: {},
  filteredEvents: [],
  selectedEvent: null,
  nearbyEvents: [],
  userEvents: {
    attending: [],
    organizing: [],
    interested: [],
  },
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchEvent = createAsyncThunk(
  'events/fetchEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      const eventData = eventDoc.data();
      return { id: eventId, ...eventData } as Event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNearbyEvents = createAsyncThunk(
  'events/fetchNearby',
  async ({ 
    latitude, 
    longitude, 
    radiusInKm = 50,
    maxResults = 30 
  }: { 
    latitude: number; 
    longitude: number; 
    radiusInKm?: number;
    maxResults?: number;
  }, { rejectWithValue }) => {
    try {
      // In a real app, you would use geohashing or a geospatial query
      // For simplicity, we'll just get all active events
      // In production, you'd implement pagination and proper geo queries
      
      const eventsQuery = query(
        collection(db, 'events'),
        where('basic_info.status', '==', 'active'),
        where('basic_info.dateTime', '>=', new Date()),
        orderBy('basic_info.dateTime'),
        limit(maxResults)
      );
      
      const querySnapshot = await getDocs(eventsQuery);
      const events: Record<string, Event> = {};
      const eventIds: string[] = [];
      
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        events[doc.id] = { id: doc.id, ...eventData } as Event;
        eventIds.push(doc.id);
      });
      
      return { events, eventIds };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'events/fetchUserEvents',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch events where user is organizer
      const organizingQuery = query(
        collection(db, 'events'),
        where('basic_info.organizerId', '==', userId)
      );
      
      const organizingSnapshot = await getDocs(organizingQuery);
      const organizing: string[] = [];
      const events: Record<string, Event> = {};
      
      organizingSnapshot.forEach((doc) => {
        const eventData = doc.data();
        events[doc.id] = { id: doc.id, ...eventData } as Event;
        organizing.push(doc.id);
      });
      
      // Fetch events where user is attendee
      const attendingQuery = query(
        collection(db, 'events'),
        where('attendees.approved', 'array-contains', userId)
      );
      
      const attendingSnapshot = await getDocs(attendingQuery);
      const attending: string[] = [];
      
      attendingSnapshot.forEach((doc) => {
        const eventData = doc.data();
        events[doc.id] = { id: doc.id, ...eventData } as Event;
        attending.push(doc.id);
      });
      
      // Get user's interested events from Firestore
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      let interested: string[] = [];
      if (userDoc.exists() && userDoc.data().eventInteractions?.interested) {
        interested = userDoc.data().eventInteractions.interested;
      }
      
      return { events, userEvents: { organizing, attending, interested } };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async ({ 
    eventData,
    userId
  }: { 
    eventData: Omit<Event['basic_info'], 'createdAt' | 'currentAttendees' | 'organizerId'> & { 
      screening?: Event['screening'] 
    };
    userId: string;
  }, { rejectWithValue }) => {
    try {
      const timestamp = serverTimestamp();
      
      // Prepare event data
      const newEvent = {
        basic_info: {
          ...eventData,
          createdAt: timestamp,
          organizerId: userId,
          currentAttendees: 1, // Organizer is automatically an attendee
          status: 'active' as const,
        },
        screening: eventData.screening || {
          questions: [],
          autoApprove: true,
        },
        attendees: {
          approved: [userId], // Organizer is automatically approved
          pending: [],
          rejected: [],
        },
      };
      
      // Create event in Firestore
      const eventRef = await addDoc(collection(db, 'events'), newEvent);
      
      // Update user's organized events list
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'eventInteractions.organized': arrayUnion(eventRef.id),
        'eventInteractions.attending': arrayUnion(eventRef.id),
        'stats.eventsOrganized': increment(1),
      });
      
      // Get the created event
      const eventDoc = await getDoc(eventRef);
      
      return { id: eventRef.id, ...eventDoc.data() } as Event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<string>) => {
      state.selectedEvent = state.events[action.payload] || null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch event
      .addCase(fetchEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.status = 'succeeded';
        state.events[action.payload.id] = action.payload;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch nearby events
      .addCase(fetchNearbyEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNearbyEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = { ...state.events, ...action.payload.events };
        state.nearbyEvents = action.payload.eventIds;
        state.filteredEvents = action.payload.eventIds;
      })
      .addCase(fetchNearbyEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch user events
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.events = { ...state.events, ...action.payload.events };
        state.userEvents = action.payload.userEvents;
      })
      
      // Create event
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events[action.payload.id] = action.payload;
        state.userEvents.organizing.push(action.payload.id);
        state.userEvents.attending.push(action.payload.id);
      });
  },
});

export const { setSelectedEvent, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer; 