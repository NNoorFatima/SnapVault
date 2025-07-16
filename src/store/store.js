import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import groupsReducer from './slices/groupsSlice';
import photosReducer from './slices/photosSlice';
import facesReducer from './slices/facesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    groups: groupsReducer,
    photos: photosReducer,
    faces: facesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // optional but common in async situations
    }),
});

export default store;
