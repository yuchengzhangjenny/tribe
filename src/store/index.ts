import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import eventsReducer from './eventsSlice';
import promptsReducer from './promptsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    events: eventsReducer,
    prompts: promptsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 