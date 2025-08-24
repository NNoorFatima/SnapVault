import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiFactory from '../../api/ApiFactory';

// Fetch user's groups
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (options = {}, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.getMyGroups(options);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch groups');
    }
  }
);

// Create new group
export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.createGroup(groupData);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create group');
    }
  }
);

// Join group
export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (joinData, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.joinGroup(joinData);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to join group');
    }
  }
);

// Leave group
export const leaveGroup = createAsyncThunk(
  'groups/leaveGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.leaveGroup(groupId);
      
      return { response, groupId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to leave group');
    }
  }
);

// Get group details
export const getGroupDetails = createAsyncThunk(
  'groups/getGroupDetails',
  async (groupId, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.getGroupDetails(groupId);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch group details');
    }
  }
);

// Update group
export const updateGroup = createAsyncThunk(
  'groups/updateGroup',
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.updateGroup(groupId, groupData);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update group');
    }
  }
);

// Delete group
export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.deleteGroup(groupId);
      
      return { response, groupId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete group');
    }
  }
);

// Search groups
export const searchGroups = createAsyncThunk(
  'groups/searchGroups',
  async (searchOptions, { rejectWithValue }) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const response = await groupsService.searchGroups(searchOptions);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search groups');
    }
  }
);

const initialState = {
  data: [],
  currentGroup: null,
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    resetGroups: (state) => {
      state.data = [];
      state.currentGroup = null;
      state.searchResults = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    removeGroupFromList: (state, action) => {
      state.data = state.data.filter(group => group.id !== action.payload);
    },
    addGroupToList: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateGroupInList: (state, action) => {
      const index = state.data.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.groups || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        const newGroup = action.payload.group || action.payload;
        state.data.unshift(newGroup);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Join group
      .addCase(joinGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.loading = false;
        const joinedGroup = action.payload.group || action.payload;
        state.data.unshift(joinedGroup);
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Leave group
      .addCase(leaveGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(group => group.id !== action.payload.groupId);
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get group details
      .addCase(getGroupDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload.group || action.payload;
      })
      .addCase(getGroupDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update group
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGroup = action.payload.group || action.payload;
        
        // Update in list
        const index = state.data.findIndex(group => group.id === updatedGroup.id);
        if (index !== -1) {
          state.data[index] = updatedGroup;
        }
        
        // Update current group
        if (state.currentGroup && state.currentGroup.id === updatedGroup.id) {
          state.currentGroup = updatedGroup;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(group => group.id !== action.payload.groupId);
        
        // Clear current group if it was deleted
        if (state.currentGroup && state.currentGroup.id === action.payload.groupId) {
          state.currentGroup = null;
        }
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search groups
      .addCase(searchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.groups || action.payload;
      })
      .addCase(searchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetGroups, 
  clearError, 
  setCurrentGroup, 
  clearSearchResults, 
  removeGroupFromList, 
  addGroupToList, 
  updateGroupInList 
} = groupsSlice.actions;
export default groupsSlice.reducer;