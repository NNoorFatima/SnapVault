import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

export const uploadPhoto = createAsyncThunk('photos/upload', async (photoData, thunkAPI) => {
  try {
    const res = await axios.post('/photos/upload', photoData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const getGroupPhotos = createAsyncThunk('photos/getGroupPhotos', async (groupId, thunkAPI) => {
  try {
    const res = await axios.get(`/photos/group/${groupId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const photosSlice = createSlice({
  name: 'photos',
  initialState: { photos: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadPhoto.fulfilled, (state, action) => { state.photos.push(action.payload); })
      .addCase(getGroupPhotos.pending, (state) => { state.isLoading = true; })
      .addCase(getGroupPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.photos = action.payload;
      })
      .addCase(getGroupPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default photosSlice.reducer;
