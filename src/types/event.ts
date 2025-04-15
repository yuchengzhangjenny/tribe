export interface EventBasicInfo {
  title: string;
  description: string;
  type?: string;
  tags?: string[];
  organizerId: string;
  dateTime: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  maxCapacity: number;
  currentAttendees: number;
  status: 'active' | 'cancelled' | 'completed';
  photos?: string[];
  public: boolean;
}

export interface EventScreening {
  questions?: Array<{
    question: string;
    required: boolean;
  }>;
  autoApprove: boolean;
}

export interface EventAttendees {
  approved: string[]; // User IDs
  pending: Array<{
    userId: string;
    answers: Record<string, string>;
    timestamp: Date;
  }>;
  rejected: string[]; // User IDs
}

export interface EventQA {
  id: string;
  userId: string;
  question: string;
  answer?: string;
  timestamp: Date;
  isAnswered: boolean;
}

export interface EventMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  uploadedBy: string; // User ID
  timestamp: Date;
  caption?: string;
}

export interface EventDetails {
  id: string;
  basicInfo: EventBasicInfo;
  screening?: EventScreening;
  attendees: EventAttendees;
  chatEnabled?: boolean;
  chatroomId?: string;
}

export interface EventSearchParams {
  query?: string;
  location?: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
  };
  tags?: string[];
  dateRange?: {
    start: Date;
    end?: Date;
  };
  maxAttendees?: number;
  organizerId?: string;
  status?: 'active' | 'cancelled' | 'completed';
} 