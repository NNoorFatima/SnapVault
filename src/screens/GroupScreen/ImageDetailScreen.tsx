import React, { useRef, useState } from 'react';
import {View, Text, Dimensions, Animated, TouchableOpacity, Alert, Share, Image,} from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './ImageDetailScreen.styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isRTL = I18nManager.isRTL;

export default function ImageDetailScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const [currentScale, setCurrentScale] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  // Get image data from route params
  const { imageUri, uploadedBy, date, id } = route.params as any || {};

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

  const handleDownload = async () => {
    try {
      Alert.alert(
        'Download Image',
        'This feature will download the image to your device gallery.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Download', 
            onPress: () => {
              // For now, show a success message
              // In a real implementation, you would use react-native-fs or similar
              Alert.alert('Success', 'Image download feature will be implemented with proper file system access. For now, you can use the share feature to save the image.');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to download image');
    }
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Share Image',
        message: `Check out this image from SnapVault!`,
        url: imageUri, // This will work for web URLs
      };

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
      <View style={{ flex: 1, backgroundColor: '#000' }}>
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

      {/* Image Info */}
      <View style={styles.imageInfoContainer}>
        <Text style={styles.imageInfoText}>
          {uploadedBy && `Uploaded by: ${uploadedBy}`}
        </Text>
        <Text style={styles.imageInfoText}>
          {date && `Date: ${date}`}
        </Text>
      </View>

      {/* Zoom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
          <Feather name="minus" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
