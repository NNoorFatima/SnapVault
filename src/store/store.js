import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groupsReducer from './slices/groupsSlice';
import photosReducer from './slices/photosSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    photos: photosReducer,
  },
});

export default store;
