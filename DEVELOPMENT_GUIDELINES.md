# Tribe App Development Guidelines

This document outlines the development standards, database structure, and architecture principles for the Tribe social events app.

## Table of Contents
- [Tribe App Development Guidelines](#tribe-app-development-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Code Quality \& Bug Minimization](#code-quality--bug-minimization)
  - [Code Understandability](#code-understandability)
  - [UI/UX Consistency](#uiux-consistency)
  - [Workflow Guidelines](#workflow-guidelines)
  - [Database Design](#database-design)
    - [Collections Structure](#collections-structure)
      - [users/](#users)
      - [prompts/](#prompts)
      - [events/](#events)
      - [chatrooms/](#chatrooms)
    - [Database Rules](#database-rules)
  - [Architecture Principles](#architecture-principles)
  - [Backend Architecture](#backend-architecture)
    - [Technology Stack](#technology-stack)
    - [API Architecture](#api-architecture)
    - [Authentication \& Security](#authentication--security)
    - [Key Services](#key-services)
    - [Infrastructure \& Deployment](#infrastructure--deployment)
    - [Development Approach](#development-approach)
  - [State Management](#state-management)
  - [Feature Implementation Status](#feature-implementation-status)

## Code Quality & Bug Minimization

- **Incremental development**: Build one feature at a time, testing each component before moving on
- **TypeScript throughout**: Use TypeScript for type safety to catch errors before runtime
- **Component isolation**: Develop and test each component in isolation before integration
- **Regular testing**: Test on real devices/simulators frequently during development
- **Error handling**: Implement proper error handling for all Firebase operations with specific error messages
- **Input validation**: Validate all user inputs before submission to Firebase
- **Loading states**: Include loading indicators for all asynchronous operations
- **Defensive coding**: Use null checks and default values to prevent runtime errors

## Code Understandability

- **Clear file structure**: Maintain the established folder structure that separates concerns
- **Consistent naming**: Use clear, descriptive names for components, functions, and variables
- **Documentation comments**: Add explanatory comments for complex logic
- **Knowledge transfer**: Document reasoning behind implementation choices
- **Component Props**: Define explicit interfaces for all component props
- **File organization**: Keep files under 300 lines of code when possible
- **Function size**: Keep functions under 30 lines of code when possible
- **Import organization**: Group imports by library, then by relative path

## UI/UX Consistency

- **Component library**: Create reusable UI components with consistent styling
- **Theme system**: Use a global theme for colors, typography, spacing, and other design elements
- **Atomic design**: Build from small, reusable components up to pages
- **Responsive design**: Ensure layouts work well across different screen sizes
- **Navigation patterns**: Establish consistent navigation patterns throughout the app
- **Error presentation**: Present errors to users in a consistent manner
- **Form handling**: Implement consistent form validation and submission patterns
- **Animation**: Use subtle, consistent animations for transitions
- **Accessibility**: Ensure components have proper accessibility labels and support

## Workflow Guidelines

- **Focus on one feature at a time**: Complete one feature before moving to the next
- **Regular reviews**: Periodically review what we've built so far
- **Iterative refinement**: Build basic versions first, then refine and polish
- **Browser tools**: Use React DevTools and Firebase Console for debugging
- **Test data**: Create sample data for development and testing
- **Documentation updates**: Update this document when architectural decisions change
- **Code comments**: Use TODO comments for incomplete features
- **Performance considerations**: Regularly check and optimize performance

## Database Design

### Collections Structure

#### users/
- **{userId}/**
  - **basic_info/**
    - displayName: string
    - email: string
    - photoURL: string | null
    - phoneNumber: string | null
    - createdAt: timestamp
    - lastActive: timestamp
    - isOnline: boolean
  - **profile/**
    - age: number
    - gender: string
    - location: {
      city: string,
      state: string,
      country: string,
      coordinates: {latitude: number, longitude: number}
    }
    - hometown: string
    - occupation: string
    - school: string
    - mbti: string
    - horoscope: string
    - bio: string
    - lookingFor: string
    - hobbies: array<string>
    - profileCompleteness: number
    - profileViewers: array<userId>
    - profileViewCount: number
  - **stats/**
    - daysOnApp: number
    - points: number
    - badges: array<string>
    - eventsAttended: number
    - eventsOrganized: number
    - connections: number
  - **userPrompts/** (Subcollection)
    - **{userPromptId}/**
      - promptId: string (reference to prompts collection)
      - promptText: string
      - answer: string
      - isVisible: boolean
      - displayOrder: number
      - createdAt: timestamp
      - updatedAt: timestamp
      - likes: array<userId>
      - comments: array<{userId, text, timestamp}>
  - **eventInteractions/**
    - attending: array<eventId>
    - organized: array<eventId>
    - interested: array<eventId>
    - rejected: array<eventId>
    - pendingRequests: array<eventId>
  - **connections/**
    - {connectionId}: userId
  - **notifications/** (Subcollection)
    - **{notificationId}/**
      - type: string
      - message: string
      - read: boolean
      - createdAt: timestamp
      - relatedId: string (userId/eventId)
      - data: map
  - **settings/**
    - notificationPreferences: map
    - privacySettings: map
    - theme: string

#### prompts/
- **{promptId}/**
  - text: string
  - category: string (optional)
  - isActive: boolean
  - displayOrder: number

#### events/
- **{eventId}/**
  - **basic_info/**
    - title: string
    - description: string
    - type: string
    - tags: array<string>
    - createdAt: timestamp
    - organizerId: userId
    - dateTime: timestamp
    - location: {latitude: number, longitude: number}
    - address: string
    - maxCapacity: number
    - currentAttendees: number
    - status: string (active, cancelled, completed)
    - photos: array<url>
    - public: boolean
  - **screening/**
    - questions: array<{question, required}>
    - autoApprove: boolean
  - **attendees/**
    - approved: array<userId>
    - pending: array<{userId, answers, timestamp}>
    - rejected: array<userId>
  - **chat/**
    - chatroomId: string (reference to chatroom)
    - enabled: boolean
  - **qa/** (Subcollection)
    - **{questionId}/**
      - userId: string
      - question: string
      - answer: string
      - timestamp: timestamp
      - isAnswered: boolean
  - **media/** (Subcollection)
    - **{mediaId}/**
      - type: string (photo/video)
      - url: string
      - uploadedBy: userId
      - timestamp: timestamp
      - caption: string

#### chatrooms/
- **{chatroomId}/**
  - **info/**
    - type: string (event/direct)
    - eventId: string (if type is event)
    - createdAt: timestamp
    - updatedAt: timestamp
    - participants: array<userId>
    - lastMessage: {text, sender, timestamp}
  - **settings/**
    - notifications: boolean
    - active: boolean
  - **messages/** (Subcollection)
    - **{messageId}/**
      - text: string
      - sender: userId
      - timestamp: timestamp
      - read: array<userId>
      - type: string (text/image/video)
      - mediaUrl: string (if applicable)

### Database Rules
1. **Data Validation**: All writes will validate data integrity
2. **Security**: Implement role-based security rules
3. **Indices**: Create indices for frequently queried fields
4. **Data Consistency**: Use transactions for multi-document updates
5. **References**: Use document references for relationships
6. **Denormalization**: Strategically denormalize data for performance
7. **Batch Operations**: Use batch operations for bulk updates
8. **Data Size**: Keep document sizes under 1MB
9. **Subcollections**: Use subcollections for one-to-many relationships
10. **Timestamps**: Use server timestamps for all time-related fields

## Architecture Principles

1. **Single Responsibility**: Each component should have a single responsibility
2. **Presentational/Container Pattern**: Separate data fetching from presentation
3. **Custom Hooks**: Create hooks for reusable logic
4. **Authentication Flow**: Implement a proper authentication flow with protected routes
5. **Error Boundaries**: Use React error boundaries for graceful failures
6. **Service Layer**: Encapsulate Firebase operations in service modules
7. **Environment Variables**: Use environment variables for configuration
8. **Immutability**: Treat state as immutable
9. **Pure Functions**: Create pure functions for business logic
10. **Code Splitting**: Implement code splitting for better performance

## Backend Architecture

### Technology Stack

1. **Core Backend**
   - **Node.js with Express.js**:
     - Consistent with frontend JavaScript ecosystem
     - Excellent performance for real-time applications
     - Extensive library ecosystem for rapid development
     - TypeScript support for type safety

2. **Database Layer**
   - **Primary Database: Firebase Firestore**
     - Aligns with Firebase Auth and other Firebase services
     - Real-time data capabilities
     - Flexible schema for social app features
     - Scales well for growing user bases
     - Direct integration with client apps
   
   - **Redis (Optional)**
     - Caching layer for frequent queries
     - Session management
     - Rate limiting implementation
     - Pub/sub for notifications

3. **Real-time Communication**
   - **Firebase Realtime Database / Firestore**
     - Event and chat real-time updates
     - Online status indicators
   - **Firebase Cloud Messaging**
     - Push notifications delivery
     - Cross-platform notification support

### API Architecture

1. **RESTful API Pattern**
   - Versioned endpoints (/api/v1/...)
   - Resource-based routes
   - HTTP methods for CRUD operations
   - Status codes for error handling
   - Pagination for large datasets

2. **GraphQL Layer (Optional)**
   - Flexible data fetching for complex screens
   - Reduced network usage for mobile clients
   - Single endpoint architecture
   - Type schema that matches frontend requirements

3. **API Documentation**
   - OpenAPI/Swagger specification
   - Interactive documentation
   - Endpoint examples
   - Response schemas

### Authentication & Security

1. **Firebase Authentication**
   - Email/password authentication
   - Social provider integration (Google, Apple, Facebook)
   - JWT token-based authentication
   - Secure token refresh mechanism

2. **Security Measures**
   - Firebase Security Rules implementation
   - Input validation and sanitization
   - Rate limiting for API endpoints
   - CORS configuration
   - Content Security Policy
   - Data encryption for sensitive information

3. **Privacy Compliance**
   - GDPR compliance mechanisms
   - Data retention policies
   - User data export capability
   - Account deletion process

### Key Services

1. **User Service**
   - Registration and authentication
   - Profile management
   - Social connections
   - Privacy settings
   - User activity tracking

2. **Event Service**
   - Event CRUD operations
   - Attendance management
   - Event discovery algorithms
   - Filtering and search capabilities
   - Location-based services

3. **Chat Service**
   - Direct messaging
   - Group chats for events
   - Message persistence
   - Read receipts
   - Media sharing in chats

4. **Notification Service**
   - Push notification delivery
   - In-app notification management
   - Email notifications
   - Custom notification preferences
   - Batching and throttling

5. **Analytics Service**
   - User behavior tracking
   - Event popularity metrics
   - Engagement statistics
   - Retention analytics
   - Performance monitoring

### Infrastructure & Deployment

1. **Firebase Project Structure**
   - Separate environments (development, staging, production)
   - CI/CD pipeline integration
   - Automated testing before deployment
   - Rollback capabilities

2. **Serverless Architecture**
   - Firebase Cloud Functions for API implementation
   - Event-driven architecture
   - Microservices pattern where appropriate
   - Auto-scaling based on demand

3. **Storage Solutions**
   - Firebase Storage for user-generated content
   - CDN integration for media delivery
   - Caching strategies for frequently accessed content
   - Image processing and optimization

4. **Monitoring & Operations**
   - Firebase Performance Monitoring
   - Error tracking and reporting
   - Usage analytics
   - Cost monitoring
   - Alerting system for critical issues

### Development Approach

1. **Phased Implementation**
   - Core authentication and user management first
   - Event discovery and management second
   - Social features third
   - Advanced features (chat, recommendations) last

2. **API-First Development**
   - Define API contracts before implementation
   - Mock API responses for frontend development
   - Parallel development of frontend and backend

3. **Testing Strategy**
   - Unit tests for service functions
   - Integration tests for API endpoints
   - End-to-end tests for critical flows
   - Performance tests for database queries
   - Security tests for authentication

4. **Documentation Requirements**
   - API documentation with examples
   - Database schema changes
   - Service interaction diagrams
   - Environment setup instructions
   - Deployment procedures

## State Management

1. **Redux Structure**: Organize Redux by feature (auth, users, events, etc.)
2. **Action Types**: Use descriptive action type names
3. **Async Thunks**: Use createAsyncThunk for asynchronous actions
4. **Normalized State**: Normalize state for efficient access
5. **Selectors**: Use selectors for accessing state
6. **Local State**: Use local state for UI-only concerns
7. **Persistence**: Persist necessary state to local storage
8. **State Updates**: Update state immutably
9. **Loading States**: Track loading states for all async operations
10. **Error States**: Track error states for all async operations

## Feature Implementation Status

| Feature | Status | Description | Last Updated |
|---------|--------|-------------|--------------|
| Project Setup | Complete | Basic Expo setup with TypeScript | YYYY-MM-DD |
| Firebase Config | Incomplete | Firebase configuration | YYYY-MM-DD |
| Authentication | Incomplete | User registration and login | YYYY-MM-DD |
| Navigation | Incomplete | App navigation structure | YYYY-MM-DD |
| User Profile | Incomplete | User profile creation and display | YYYY-MM-DD |
| Profile Prompts | Incomplete | User-selectable profile prompts | YYYY-MM-DD |
| Event Creation | Incomplete | Create and manage events | YYYY-MM-DD |
| Event Discovery | Incomplete | Find and filter events | YYYY-MM-DD |
| Chat System | Incomplete | Real-time chat functionality | YYYY-MM-DD |
| Notifications | Incomplete | In-app and push notifications | YYYY-MM-DD |

---

**Note**: Any changes to architecture, database design, or principles should be discussed and documented in this file before implementation. 