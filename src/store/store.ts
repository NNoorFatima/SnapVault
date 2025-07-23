import facesReducer from './slices/facesSlice';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import groupsReducer from './slices/groupsSlice';
import photosReducer from './slices/photosSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    groups: groupsReducer,
    photos: photosReducer,
    faces: facesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // optional but common in async situations
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
