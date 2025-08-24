# Photo Upload Implementation for Group Screen

## Overview
This document describes the implementation of the photo upload feature for the group screen in the SnapVault React Native app.

## Backend API Endpoints

### Upload Photos
- **Endpoint**: `POST /photos/upload`
- **Parameters**:
  - `group_id` (int, required): The ID of the group to upload photos to
  - `files` (array of files, required): Array of image files (JPG, JPEG, PNG)
- **Response**: Array of uploaded photo objects with IDs and file paths
- **Authentication**: Required (user must be a member of the group with upload permissions)

### Get Group Photos
- **Endpoint**: `GET /photos/group/{group_id}`
- **Parameters**:
  - `group_id` (int, required): The ID of the group
- **Response**: Array of all photos in the group
- **Authentication**: Required (user must be a member of the group)

### Get My Photos in Group
- **Endpoint**: `GET /photos/my/photos/{group_id}`
- **Parameters**:
  - `group_id` (int, required): The ID of the group
- **Response**: Array of photos where the current user appears (face recognition)
- **Authentication**: Required (user must be a member of the group)

## Frontend Implementation

### Key Components

#### 1. PhotosService (`src/api/services/PhotosService.js`)
- Handles all photo-related API calls
- Supports single and multiple photo uploads
- Transforms API responses to include full photo URLs
- Validates file types and sizes

#### 2. GroupScreen (`src/screens/GroupScreen/GroupScreen.js`)
- Main screen for viewing and uploading group photos
- Two tabs: "My Pictures" (face recognition) and "All Pictures"
- Pull-to-refresh functionality
- Loading states and error handling

### Features Implemented

#### Photo Upload
- Multiple photo selection (up to 10 photos)
- File type validation (JPG, JPEG, PNG)
- Progress indication during upload
- Automatic refresh after successful upload
- Error handling with user-friendly messages

#### Photo Display
- Grid layout for photos
- Separate tabs for user's photos vs all group photos
- Photo metadata (uploader, date)
- Loading states and empty states
- Pull-to-refresh functionality

#### Error Handling
- Network error handling
- File validation errors
- Permission errors
- User-friendly error messages

### Usage

#### Uploading Photos
1. Navigate to a group screen
2. Tap the "Upload Image" button
3. Select one or more photos from the device gallery
4. Photos will be uploaded to the server with face recognition processing
5. The photo grid will automatically refresh to show new photos

#### Viewing Photos
- **My Pictures Tab**: Shows photos where the current user appears (using face recognition)
- **All Pictures Tab**: Shows all photos uploaded to the group
- Pull down to refresh the photo list

### Technical Details

#### File Upload Process
1. User selects photos using `react-native-image-picker`
2. Files are prepared with proper metadata (URI, type, filename)
3. FormData is created with `group_id` and `files` array
4. Photos are uploaded using the PhotosService
5. Backend processes photos with face recognition
6. Response includes photo IDs and file paths
7. Frontend refreshes photo list

#### Photo URL Generation
- Backend returns relative file paths (e.g., `uploads/photos/uuid.jpg`)
- Frontend constructs full URLs using the API base URL
- Photos are served as static files from the backend

#### State Management
- Uses React hooks for local state management
- Redux for global auth state
- Loading states for upload and fetch operations
- Error states with user feedback

### Dependencies
- `react-native-image-picker`: Photo selection from device
- `axios`: HTTP client for API calls
- `react-native-vector-icons`: UI icons
- `react-redux`: State management

### Configuration
- API base URL configured in `src/api/config/ApiConfig.js`
- File upload limits and validation in PhotosService
- Error handling and retry logic in ApiClient

## Testing

### Manual Testing Steps
1. Start the backend server
2. Run the React Native app
3. Navigate to a group screen
4. Test photo upload with various file types
5. Test photo viewing in both tabs
6. Test error scenarios (network issues, invalid files)
7. Test pull-to-refresh functionality

### Expected Behavior
- Photos should upload successfully and appear in the grid
- Face recognition should work for "My Pictures" tab
- Error messages should be clear and actionable
- Loading states should provide good user feedback
- Pull-to-refresh should update the photo list

## Future Enhancements
- Photo compression before upload
- Photo editing capabilities
- Photo sharing functionality
- Advanced face recognition features
- Photo comments and reactions
- Photo download functionality 