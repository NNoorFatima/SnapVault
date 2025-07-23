# GROUPS.GET_GROUP API Implementation

This document describes the implementation of the GROUPS.GET_GROUP API to show user's groups on the dashboard.

## Overview

The implementation includes:
1. Backend API endpoint: `/groups/my` - Returns user's groups
2. Frontend Redux integration with groups slice
3. Dashboard screen integration to fetch and display groups
4. Create and join group functionality

## Backend API

### Endpoint: `GET /groups/my`

**Response Format:**
```json
[
  {
    "id": 0,
    "name": "string",
    "invite_code": "string",
    "created_at": "2025-07-23T07:47:43.188Z",
    "description": "string",
    "creator": {
      "id": 0,
      "name": "string",
      "email": "string",
      "bio": "string",
      "created_at": "2025-07-23T07:47:43.188Z",
      "profile_picture": "string"
    }
  }
]
```

**Authentication:** Required (Bearer token)

## Frontend Implementation

### Files Modified:

1. **`src/screens/DashBoard/DashboardScreen.tsx`**
   - Added Redux integration
   - Fetches groups on component mount
   - Transforms API data to match UI requirements
   - Handles create/join group actions

2. **`src/store/slices/groupsSlice.js`**
   - Fixed import for ApiFactory
   - Contains all group-related Redux actions

3. **`src/api/services/GroupsService.js`**
   - Already had `getMyGroups()` method implemented
   - Handles API communication

### Data Flow:

1. Dashboard loads → `fetchGroupsData()` called
2. Redux action `fetchGroups` dispatched
3. GroupsService calls `/groups/my` endpoint
4. Response transformed and stored in Redux state
5. Dashboard displays groups from Redux state

## Testing

### Backend Testing

Run the backend test script:
```bash
cd SnapVault-Backend
python test_groups_with_auth.py
```

This will:
1. Start the server (if not running)
2. Register a test user
3. Login to get access token
4. Test getting user's groups
5. Create a test group
6. Test getting groups again
7. Test getting specific group details

### Frontend Testing

1. Start the backend server:
```bash
cd SnapVault-Backend
python main.py
```

2. Start the React Native app:
```bash
cd SnapVault
npx react-native run-android  # or run-ios
```

3. Login to the app
4. Navigate to Dashboard
5. Check console logs for groups data
6. Test creating a new group
7. Test joining a group with invite code

## API Endpoints Used

- `GET /groups/my` - Get user's groups
- `POST /groups/create` - Create new group
- `POST /groups/join` - Join group with invite code
- `GET /groups/{id}` - Get specific group details

## Error Handling

- Network errors are logged but don't show user-facing errors
- API errors show toast notifications
- Fallback to empty groups array if no data

## Next Steps

1. **Display Enhancement**: Improve the groups display with better styling
2. **Member Count**: Add member count to groups (requires additional API endpoint)
3. **Group Images**: Add support for group profile pictures
4. **Real-time Updates**: Add WebSocket support for real-time group updates
5. **Pagination**: Add pagination for large numbers of groups

## Troubleshooting

### Common Issues:

1. **"API Factory not initialized"**
   - Ensure the app is properly logged in
   - Check that ApiFactory is initialized in the app startup

2. **"Network error"**
   - Check if backend server is running
   - Verify the API base URL in ApiConfig.js

3. **"Authentication failed"**
   - Ensure user is logged in
   - Check if access token is valid

4. **"No groups displayed"**
   - Check console logs for API response
   - Verify user has groups in the database
   - Check Redux state for groups data

### Debug Commands:

```javascript
// In React Native debugger
console.log('Redux groups state:', store.getState().groups);
console.log('API Factory config:', apiFactory.getConfig());
``` 