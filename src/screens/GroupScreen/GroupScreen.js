import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
// Import clipboard with fallback
let Clipboard;
try {
  Clipboard = require('@react-native-clipboard/clipboard').default;
} catch (error) {
  console.warn('@react-native-clipboard/clipboard not available, using fallback');
  Clipboard = {
    setString: (text) => {
      console.log('Clipboard fallback - would copy:', text);
      Alert.alert('Clipboard Not Available', 'Please install @react-native-clipboard/clipboard to use this feature.');
    }
  };
}
// Import image picker with fallback
let launchImageLibrary;
try {
  const ImagePicker = require('react-native-image-picker');
  launchImageLibrary = ImagePicker.launchImageLibrary;
} catch (error) {
  console.warn('react-native-image-picker not available, using fallback');
  launchImageLibrary = (options, callback) => {
    // Fallback implementation
    Alert.alert(
      'Image Picker Not Available',
      'Please install react-native-image-picker to use this feature.',
      [{ text: 'OK' }]
    );
    callback({ didCancel: true });
  };
}

const GroupScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { groupId, groupName, groupDescription, groupCode } = route.params || {
    groupId: 1,
    groupName: t('GroupScreen.sampleName'),
    groupDescription: t('GroupScreen.sampleDescription'),
    groupCode: 'ABC123'
  };
  const [activeTab, setActiveTab] = useState('myPictures');
  const [myPictures, setMyPictures] = useState([]);
  const [allPictures, setAllPictures] = useState([
    { id: 1, uri: 'https://placehold.co/300x300/6366F1/FFFFFF', uploadedBy: 'User 1', date: '2024-01-15' },
    { id: 2, uri: 'https://placehold.co/300x300/10B981/FFFFFF', uploadedBy: 'User 2', date: '2024-01-14' },
    { id: 3, uri: 'https://placehold.co/300x300/F59E0B/FFFFFF', uploadedBy: 'User 3', date: '2024-01-13' },
    { id: 4, uri: 'https://placehold.co/300x300/EF4444/FFFFFF', uploadedBy: 'User 1', date: '2024-01-12' },
  ]);

  const handleCopyGroupCode = () => {
    Clipboard.setString(groupCode);
    Alert.alert('Copied!', 'Group code copied to clipboard');
  };

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0]) {
        const newImage = {
          id: Date.now(),
          uri: response.assets[0].uri,
          uploadedBy: 'You',
          date: new Date().toISOString().split('T')[0],
        };
        setMyPictures([newImage, ...myPictures]);
        setAllPictures([newImage, ...allPictures]);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    });
  };

  const screenWidth = Dimensions.get('window').width;
  const contentWrapperWidth = Math.min(screenWidth - 32, 420);

  const renderImageGrid = (images) => {
    return (
      <View style={styles.imageGrid}>
        {images.map((image) => (
          <View key={image.id} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.gridImage} />
            <View style={styles.imageInfo}>
              <Text style={styles.imageUploader}>{image.uploadedBy}</Text>
              <Text style={styles.imageDate}>{image.date}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, { width: contentWrapperWidth }]}>
          {/* Status Bar Spacer */}
          <View style={styles.statusBarSpacer} />

          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('GroupScreen.details')}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Group Info Card */}
          <ImageBackground
            source={require('../DashBoard/img/background.png')}
            resizeMode="cover"
            style={styles.groupInfoCard}
            imageStyle={styles.groupInfoCardImage}
          >
            <View style={styles.groupInfoContent}>
              <View style={styles.groupHeader}>
                <Image
                  source={require('../DashBoard/img/group1.png')}
                  style={styles.groupImage}
                />
                <View style={styles.groupTextContainer}>
                  <Text style={styles.groupName}>{t('GroupScreen.sampleName')}</Text>
                  <Text style={styles.groupDescription}>{t('GroupScreen.sampleDescription')}</Text>
                </View>
              </View>
              
              <View style={styles.groupCodeContainer}>
                <Text style={styles.groupCodeLabel}>{t('GroupScreen.code')}</Text>
                <View style={styles.groupCodeBox}>
                  <Text style={styles.groupCodeText}>{groupCode}</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyGroupCode}>
                    <Text style={styles.copyButtonText}>📋</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
              >
                <Text style={styles.uploadButtonIcon}>📷</Text>
                <Text style={styles.uploadButtonText}>{t('GroupScreen.uploadImage')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'myPictures' && styles.activeTab]}
              onPress={() => setActiveTab('myPictures')}
            >
              <Text style={[styles.tabText, activeTab === 'myPictures' && styles.activeTabText]}>
                {t('GroupScreen.myPics')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'allPictures' && styles.activeTab]}
              onPress={() => setActiveTab('allPictures')}
            >
              <Text style={[styles.tabText, activeTab === 'allPictures' && styles.activeTabText]}>
                {t('GroupScreen.allPics')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'myPictures' ? (
              myPictures.length > 0 ? (
                renderImageGrid(myPictures)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📸</Text>
                  <Text style={styles.emptyStateTitle}>{t('GroupScreen.noPics')}</Text>
                  <Text style={styles.emptyStateText}>
                    {t('GroupScreen.desc')}
                  </Text>
                </View>
              )
            ) : (
              renderImageGrid(allPictures)
            )}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 50,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 44,
  },

  // Group Info Card Styles
  groupInfoCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9573e5',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  groupInfoCardImage: {
    borderRadius: 24,
  },
  groupInfoContent: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  groupTextContainer: {
    flex: 1,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  groupDescription: {
    color: '#F1F5F9',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  groupCodeContainer: {
    marginBottom: 20,
  },
  groupCodeLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  groupCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  groupCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  copyButtonText: {
    fontSize: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  // Tabs Styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  // Tab Content Styles
  tabContent: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gridImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  imageInfo: {
    padding: 12,
  },
  imageUploader: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  imageDate: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  bottomSpacer: {
    height: 40,
  },
});

export default GroupScreen; 