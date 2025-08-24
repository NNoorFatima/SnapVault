import React, { useRef, useState } from 'react';
import {View, Text, Dimensions, Animated, TouchableOpacity, Alert, Share,} from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './ImageDetailScreen.styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import ApiFactory from '../../api/ApiFactory';
// import RNFetchBlob from 'rn-fetch-blob'; //for download
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isRTL = I18nManager.isRTL;

export default function ImageDetailScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const [currentScale, setCurrentScale] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const photosService = ApiFactory.getPhotosService();

  // Get image data from route params
  const { imageUri, uploadedBy, date, id } = route.params as any || {};

  // Get the full image URL using PhotosService
  const getFullImageUrl = (uri: string) => {
    if (!uri) return null;
    
    let fullUrl;
    
    // If it's already a full URL, use it directly
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      fullUrl = uri;
      console.log('Using existing full URL:', fullUrl);
    } else {
      // If it's a relative path, construct full URL using PhotosService
      fullUrl = photosService.getPhotoUrl(uri);
      console.log('Original URL from PhotosService:', fullUrl);
    }
    
    // Clean up the URL by replacing backslashes with forward slashes
    if (fullUrl) {
      const cleanedUrl = fullUrl.replace(/\\/g, '/');
      console.log('Cleaned URL:', cleanedUrl);
      return cleanedUrl;
    }
    
    return fullUrl;
  };



  const zoomIn = () => {
    const newScale = Math.min(currentScale + 0.2, 3);
    setCurrentScale(newScale);
    Animated.timing(scale, {
      toValue: newScale,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const zoomOut = () => {
    const newScale = Math.max(currentScale - 0.2, 1);
    setCurrentScale(newScale);
    Animated.timing(scale, {
      toValue: newScale,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
// Request permission to access external storage on Android
  const requestPermission = async () => {
    try {
      // For Android devices (API 23+), we need to request storage permission at runtime
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save images.',
          }
        );
        
        // Return true if the permission is granted, otherwise false
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
          return true;
        } else {
          console.log('Storage permission denied');
          return false;
        }
      } else {
        // For iOS, permission is generally not required for saving files to the device's documents directory
        return true;
      }
    } catch (err) {
      console.warn('Permission error: ', err);
      return false;
    }
  };
const handleDownload = async () => {
  try {
    if (!imageUri) {
      Alert.alert('Error', 'No image available to download');
      return;
    }

    const fullImageUrl = getFullImageUrl(imageUri);
    console.log('Full image URL for download:', fullImageUrl);

    if (!fullImageUrl) {
      Alert.alert('Error', 'Could not generate full image URL');
      return;
    }

    // Request storage permissions (for Android)
    const permissionGranted = await requestPermission();
    if (!permissionGranted) {
      Alert.alert('Permission Denied', 'Cannot save image without storage permission');
      return;
    }

    // Set the download path (for Android, you can use `RNFS.DownloadDirectoryPath`)
    const downloadPath = RNFS.DownloadDirectoryPath + '/image_' + Date.now() + '.jpg';
    console.log('Saving image to:', downloadPath);

    // Download the image using `react-native-fs`
    const downloadResult = await RNFS.downloadFile({
      fromUrl: fullImageUrl,   // The image URL
      toFile: downloadPath,    // Path to save the image
    }).promise;

    // Check if the image was downloaded successfully
    if (downloadResult.statusCode === 200) {
      // Trigger media scan for Android (to show the image in the gallery)
      if (Platform.OS === 'android') {
        RNFS.scanFile(downloadPath );  // Corrected to pass a single object
      }

      Alert.alert('Success', 'Image saved to downloads directory!');
    } else {
      Alert.alert('Error', 'Failed to download image.');
    }

  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download image. Please try again.');
  }
};

  const handleShare = async () => {
    try {
      if (!imageUri) {
        Alert.alert('Error', 'No image available to share');
        return;
      }

      const fullImageUrl = getFullImageUrl(imageUri);
      console.log('Original image URI:', imageUri);
      console.log('Full image URL for sharing:', fullImageUrl);

      if (!fullImageUrl) {
        Alert.alert('Error', 'Could not generate full image URL');
        return;
      }

      // Check if the image URI is a local file or remote URL
      const isLocalFile = fullImageUrl.startsWith('file://') || fullImageUrl.startsWith('content://');
      const isRemoteUrl = fullImageUrl.startsWith('http://') || fullImageUrl.startsWith('https://');

      console.log('Is local file:', isLocalFile);
      console.log('Is remote URL:', isRemoteUrl);

      let shareOptions;
      
      if (isLocalFile) {
        // For local files, share the file directly
        shareOptions = {
          title: 'Share Image from SnapVault',
          message: `Check out this image from SnapVault!\n\nImage URL: ${fullImageUrl}`,
          url: fullImageUrl,
        };
      } else if (isRemoteUrl) {
        // For remote URLs, try to share the URL directly
        shareOptions = {
          title: 'Share Image from SnapVault',
          message: `Check out this image from SnapVault!\n\nImage URL: ${fullImageUrl}`,
          url: fullImageUrl,
        };
      } else {
        // Fallback to just sharing the URL as text
        shareOptions = {
          title: 'Share Image from SnapVault',
          message: `Check out this image from SnapVault!\n\nImage URL: ${fullImageUrl}`,
        };
      }

      console.log('Sharing with options:', shareOptions);

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.rectangle}>
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.pictures}>{t('ImageDetailScreen.title')}</Text>
        </View>

        <View style={styles.flexRowDd}>
          <View style={styles.regroup}>
            <TouchableOpacity style={styles.iconBackground} onPress={handleDownload}>
              <Feather name="download" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBackground} onPress={handleShare}>
              <Feather name="share" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Zoomable Image */}
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Image
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={{
            width: screenWidth,
            height: screenHeight * 0.5,
            transform: [{ scale }],
            backgroundColor: '#000',
          }}
        />
      </View>

      {/* Zoom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={zoomOut}>
          <Feather name="minus" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomIn}>
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
