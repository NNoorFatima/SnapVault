import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from 'axios';

export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://your-backend-ip:port/api/photos/group/${groupId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch photos');
    }
  }
);

const photosSlice = createSlice({
  name: 'photos',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetPhotos: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPhotos } = photosSlice.actions;
export default photosSlice.reducer;
// This file defines the photos slice of the Redux store, handling fetching and resetting photos data for groups.
// It uses createAsyncThunk to fetch photos from the backend with axios and includes reducers for managing the state.