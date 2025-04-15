export interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string | null;
  phoneNumber?: string | null;
  age?: number;
  gender?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
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
}

export interface UserStats {
  daysOnApp: number;
  points: number;
  badges: string[];
  eventsAttended: number;
  eventsOrganized: number;
  connections: number;
}

export interface UserSettings {
  notificationPreferences: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    eventReminders: boolean;
    newMessages: boolean;
    connectionRequests: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'connections' | 'private';
    showLocation: boolean;
    showActivity: boolean;
  };
  theme: 'light' | 'dark' | 'system';
} 