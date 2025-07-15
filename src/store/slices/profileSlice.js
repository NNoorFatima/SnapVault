import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFactory } from '../../api/ApiFactory';

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.getProfile();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.updateProfile(profileData);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Upload avatar
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async ({ imageData, onProgress }, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.uploadAvatar(imageData, onProgress);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Delete avatar
export const deleteAvatar = createAsyncThunk(
  'profile/deleteAvatar',
  async (_, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.deleteAvatar();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete avatar');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.changePassword(passwordData);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

// Get user statistics
export const getUserStatistics = createAsyncThunk(
  'profile/getUserStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.getStatistics();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  }
);

// Update preferences
export const updatePreferences = createAsyncThunk(
  'profile/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const profileService = apiFactory.getProfileService();
      const response = await profileService.updatePreferences(preferences);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update preferences');
    }
  }
);

const initialState = {
  data: null,
  statistics: null,
  preferences: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.statistics = null;
      state.preferences = null;
      state.loading = false;
      state.error = null;
      state.uploadProgress = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    updateProfileData: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user || action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user || action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        if (state.data) {
          state.data.avatar_url = action.payload.avatar_url;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      
      // Delete avatar
      .addCase(deleteAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.loading = false;
        if (state.data) {
          state.data.avatar_url = null;
        }
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get statistics
      .addCase(getUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, clearError, setUploadProgress, updateProfileData } = profileSlice.actions;
export default profileSlice.reducer;