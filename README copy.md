 # Tribe - Social Events App

Tribe is a social events app that helps people discover and connect through shared interests and events. This app is built with Expo, React Native, Redux Toolkit, and Firebase.

## 📱 Features

- **User Authentication**: Register, login, and profile management
- **Profile Prompts**: Dating-app style profile prompts for users to express themselves
- **Event Discovery**: Find events near you with filters and swiping interface
- **Event Management**: Create and manage your own events
- **Social Interactions**: Like and comment on profiles and event details
- **Real-time Chat**: Chat with event organizers and attendees

## 🛠️ Tech Stack

- **Frontend**:
  - Expo/React Native
  - TypeScript
  - Redux Toolkit for state management
  - React Navigation for routing
  - React Native Paper for UI components

- **Backend**:
  - Firebase Authentication
  - Cloud Firestore for database
  - Firebase Storage for media
  - Firebase Cloud Functions (planned)

## 🗂️ Project Structure

```
src/
  ├── assets/           # Images, fonts, etc.
  ├── components/       # Reusable components
  │   ├── auth/         # Authentication related components
  │   ├── profile/      # Profile related components
  │   ├── events/       # Event related components
  │   ├── chat/         # Chat related components
  │   └── common/       # Common UI components
  ├── screens/          # Screen components
  │   ├── auth/         # Authentication screens
  │   ├── profile/      # Profile screens
  │   ├── events/       # Event screens
  │   └── chat/         # Chat screens
  ├── navigation/       # Navigation configuration
  ├── store/            # Redux store setup
  │   ├── index.ts      # Store configuration
  │   ├── authSlice.ts  # Authentication state
  │   ├── usersSlice.ts # Users state
  │   ├── promptsSlice.ts # Prompts state
  │   └── eventsSlice.ts # Events state
  ├── services/         # Firebase services
  │   ├── firebase.ts   # Firebase configuration
  │   └── promptService.ts # Prompts service
  ├── hooks/            # Custom hooks
  ├── utils/            # Utility functions
  ├── types/            # TypeScript types
  └── constants/        # App constants
```

## 🗄️ Database Design

### Firebase Collections

- **users/**
  - **{userId}/**
    - **basic_info/**: displayName, email, photoURL, etc.
    - **profile/**: age, gender, location, bio, etc.
    - **userPrompts/**: User's selected prompts and answers
    - **stats/**: App usage statistics
    - **eventInteractions/**: Events the user is interacting with
    - **connections/**: User connections
    - **notifications/**: User notifications
    - **settings/**: User settings

- **prompts/**
  - **{promptId}/**: Available prompts for users to answer

- **events/**
  - **{eventId}/**
    - **basic_info/**: Title, description, date, location, etc.
    - **screening/**: Questions for screening attendees
    - **attendees/**: Approved, pending, and rejected users
    - **chat/**: Chat room reference
    - **qa/**: Q&A for the event
    - **media/**: Photos and videos

- **chatrooms/**
  - **{chatroomId}/**
    - **info/**: Type, participants, etc.
    - **messages/**: Chat messages

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tribe.git
cd tribe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and set up authentication, Firestore, and Storage

4. Update Firebase configuration in `src/services/firebase.ts`

5. Start the development server
```bash
npm start
# or
yarn start
```

## 📝 Next Steps

- Implement React Navigation setup
- Create authentication screens (Login/Register)
- Build profile screens with prompt functionality
- Develop event discovery and creation features
- Implement chat functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.