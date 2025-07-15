import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

export const createGroup = createAsyncThunk('groups/create', async (groupData, thunkAPI) => {
  try {
    const res = await axios.post('/groups/create', groupData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const joinGroup = createAsyncThunk('groups/join', async (groupData, thunkAPI) => {
  try {
    const res = await axios.post('/groups/join', groupData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const getMyGroups = createAsyncThunk('groups/getMyGroups', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/groups/my');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const groupsSlice = createSlice({
  name: 'groups',
  initialState: { groups: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.fulfilled, (state, action) => { state.groups.push(action.payload); })
      .addCase(joinGroup.fulfilled, (state, action) => { state.groups.push(action.payload); })
      .addCase(getMyGroups.pending, (state) => { state.isLoading = true; })
      .addCase(getMyGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(getMyGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default groupsSlice.reducer;
