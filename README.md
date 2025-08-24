# SnapVault

A React Native app for sharing and organizing photos in groups with privacy protection.

## Features

### Dashboard
- Welcome screen with user profile
- Group statistics (Groups, Photos, Storage)
- Create and join groups functionality
- Grid view of user's groups

### Group Screen
- **Group Details**: Display group name, description, and unique group code
- **Image Upload**: Upload images from device gallery
- **Tab Navigation**: 
  - **My Pictures**: Shows only the current user's uploaded pictures
  - **All Pictures**: Shows all pictures uploaded by group members
- **Copy Group Code**: One-tap copy functionality for sharing group codes

## New Features Added

### GroupScreen Navigation
- Click on any group image in the dashboard to navigate to the GroupScreen
- Each group displays unique information passed from the dashboard
- Consistent purple gradient theme matching the dashboard design

### Image Upload Functionality
- Tap the "Upload Image" button to select images from device gallery
- Images are added to both "My Pictures" and "All Pictures" tabs
- Upload confirmation with success alerts

### Tab System
- **My Pictures Tab**: Shows only the current user's uploaded images
- **All Pictures Tab**: Shows all group member images with uploader info and dates
- Empty state for when no pictures are available

## Dependencies

The following dependencies have been added to support the new features:

```json
{
  "react-native-image-picker": "^7.1.0",
  "@react-native-clipboard/clipboard": "^1.12.1"
}
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

3. Run the app:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Usage

1. **Navigate to Group**: Tap on any group image in the dashboard
2. **View Group Details**: See group name, description, and code
3. **Upload Images**: Tap "Upload Image" to select from gallery
4. **Switch Tabs**: Use "My Pictures" and "All Pictures" tabs
5. **Copy Group Code**: Tap the clipboard icon to copy the group code

## Technical Details

### Navigation
- Added GroupScreen to the navigation stack
- Proper TypeScript typing for navigation props
- Route parameters for group information

### Image Handling
- Fallback implementation for image picker if not installed
- Error handling for image selection
- Local state management for uploaded images

### UI/UX
- Consistent purple gradient theme (#9573e5 border color)
- Responsive design with proper spacing
- Loading states and error handling
- Accessibility considerations

## File Structure

```
src/
├── screens/
│   ├── DashBoard/
│   │   └── DashboardScreen.tsx (updated with navigation)
│   └── GroupScreen/
│       └── GroupScreen.js (new screen)
├── navigation/
│   └── AppNavigator.tsx (updated with GroupScreen route)
└── components/
    └── (existing components)
```

## Future Enhancements

- Real-time image synchronization
- Image compression and optimization
- Advanced group management features
- Push notifications for new uploads
- Image sharing capabilities

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
