import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://your-backend-ip:port/api/groups/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch groups');
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetGroups: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGroups } = groupsSlice.actions;
export default groupsSlice.reducer;