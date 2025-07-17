import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFactory } from '../../api/ApiFactory';

// Fetch photos for a group
export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async ({ groupId, options = {} }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.getGroupPhotos(groupId, options);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch photos');
    }
  }
);

// Upload single photo
export const uploadPhoto = createAsyncThunk(
  'photos/uploadPhoto',
  async ({ groupId, photoData, onProgress }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.uploadPhoto(groupId, photoData, onProgress);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photo');
    }
  }
);

// Upload multiple photos
export const uploadMultiplePhotos = createAsyncThunk(
  'photos/uploadMultiplePhotos',
  async ({ groupId, photos, onProgress }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.uploadMultiplePhotos(groupId, photos, onProgress);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photos');
    }
  }
);

// Delete photo
export const deletePhoto = createAsyncThunk(
  'photos/deletePhoto',
  async (photoId, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.deletePhoto(photoId);
      
      return { response, photoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete photo');
    }
  }
);

// Toggle like on photo
export const toggleLike = createAsyncThunk(
  'photos/toggleLike',
  async ({ photoId, isLiked }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.toggleLike(photoId, isLiked);
      
      return { response, photoId, isLiked };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle like');
    }
  }
);

// Add comment to photo
export const addComment = createAsyncThunk(
  'photos/addComment',
  async ({ photoId, comment }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.addComment(photoId, comment);
      
      return { response, photoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

// Get photo comments
export const getComments = createAsyncThunk(
  'photos/getComments',
  async ({ photoId, options = {} }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.getComments(photoId, options);
      
      return { response, photoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch comments');
    }
  }
);

// Update photo caption
export const updateCaption = createAsyncThunk(
  'photos/updateCaption',
  async ({ photoId, caption }, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.updateCaption(photoId, caption);
      
      return { response, photoId, caption };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update caption');
    }
  }
);

// Search photos
export const searchPhotos = createAsyncThunk(
  'photos/searchPhotos',
  async (searchOptions, { rejectWithValue }) => {
    try {
      const photosService = apiFactory.getPhotosService();
      const response = await photosService.searchPhotos(searchOptions);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search photos');
    }
  }
);

const initialState = {
  data: [],
  currentPhoto: null,
  comments: {},
  searchResults: [],
  loading: false,
  error: null,
  uploadProgress: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    resetPhotos: (state) => {
      state.data = [];
      state.currentPhoto = null;
      state.comments = {};
      state.searchResults = [];
      state.loading = false;
      state.error = null;
      state.uploadProgress = 0;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPhoto: (state, action) => {
      state.currentPhoto = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    removePhotoFromList: (state, action) => {
      state.data = state.data.filter(photo => photo.id !== action.payload);
    },
    addPhotoToList: (state, action) => {
      state.data.unshift(action.payload);
    },
    updatePhotoInList: (state, action) => {
      const index = state.data.findIndex(photo => photo.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch photos
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.photos || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload photo
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        const newPhoto = action.payload.photo || action.payload;
        state.data.unshift(newPhoto);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      
      // Upload multiple photos
      .addCase(uploadMultiplePhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadMultiplePhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        const newPhotos = action.payload.photos || action.payload;
        if (Array.isArray(newPhotos)) {
          state.data = [...newPhotos, ...state.data];
        }
      })
      .addCase(uploadMultiplePhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      
      // Delete photo
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(photo => photo.id !== action.payload.photoId);
        
        // Clear current photo if it was deleted
        if (state.currentPhoto && state.currentPhoto.id === action.payload.photoId) {
          state.currentPhoto = null;
        }
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { photoId, isLiked } = action.payload;
        const photo = state.data.find(p => p.id === photoId);
        if (photo) {
          photo.isLiked = isLiked;
          photo.likesCount = isLiked ? photo.likesCount + 1 : photo.likesCount - 1;
        }
        
        // Update current photo
        if (state.currentPhoto && state.currentPhoto.id === photoId) {
          state.currentPhoto.isLiked = isLiked;
          state.currentPhoto.likesCount = isLiked ? 
            state.currentPhoto.likesCount + 1 : 
            state.currentPhoto.likesCount - 1;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { photoId, response } = action.payload;
        const photo = state.data.find(p => p.id === photoId);
        if (photo) {
          photo.commentsCount = (photo.commentsCount || 0) + 1;
        }
        
        // Update current photo
        if (state.currentPhoto && state.currentPhoto.id === photoId) {
          state.currentPhoto.commentsCount = (state.currentPhoto.commentsCount || 0) + 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { photoId, response } = action.payload;
        state.comments[photoId] = response.comments || response;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update caption
      .addCase(updateCaption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCaption.fulfilled, (state, action) => {
        state.loading = false;
        const { photoId, caption } = action.payload;
        const photo = state.data.find(p => p.id === photoId);
        if (photo) {
          photo.caption = caption;
        }
        
        // Update current photo
        if (state.currentPhoto && state.currentPhoto.id === photoId) {
          state.currentPhoto.caption = caption;
        }
      })
      .addCase(updateCaption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search photos
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.photos || action.payload;
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetPhotos, 
  clearError, 
  setCurrentPhoto, 
  clearSearchResults, 
  setUploadProgress, 
  removePhotoFromList, 
  addPhotoToList, 
  updatePhotoInList 
} = photosSlice.actions;
export default photosSlice.reducer;