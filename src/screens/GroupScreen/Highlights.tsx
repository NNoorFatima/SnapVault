import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { I18nManager } from 'react-native';
import BackgroundImage from '../../assets/UserProfileBackground';
import ApiFactory, { getPhotosService } from '../../api/ApiFactory';

const { width, height } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;

const HighlightsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expecting { groupId } in params
  // @ts-ignore
  const groupId = (route.params as any)?.groupId;

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!ApiFactory.isReady()) {
          await ApiFactory.initialize('development');
        }
        const photosService = getPhotosService();
        const response = await photosService.getGroupHighlights(groupId);
        const mapped = (response || []).map((p: any) => ({
          id: p.id,
          uri: p.file_url || p.file_path || '',
          created_at: p.created_at,
        }));
        setImages(mapped);
        setActiveIndex(0);
      } catch (e: any) {
        console.error('Failed to load highlights', e);
        setError(e?.message || 'Failed to load highlights');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      loadHighlights();
    } else {
      setError('Missing group id');
    }
  }, [groupId]);

  // Render function for image items in the FlatList
  const renderItem = ({ item }: any) => (
  <TouchableOpacity
    activeOpacity={1}
    style={styles.carouselItem}
    onPress={(event) => {
      const touchX = event.nativeEvent.locationX;
      const imageCenter = width / 2;

      if (touchX < imageCenter) {
        goToPrevious();
      } else {
        goToNext();
      }
    }}
  >
    <Image
      source={{ uri: item.uri }}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  </TouchableOpacity>
);


  // Handle scroll event to update active index
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  // Navigate to previous or next image
  const goToPrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const goToNext = () => {
    if (activeIndex < images.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* BackgroundImage should cover the entire screen */}
      <BackgroundImage />

      <View style={styles.scrollView}>
        {/* Header */}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Highlights</Text>
        </View>

        {/* Content: Rectangle box with FlatList for horizontal scroll */}
        <View style={styles.rectangle}>
          {/* Loading / Error / Data states */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <Text style={{ color: 'white' }}>{error}</Text>
          ) : images.length === 0 ? (
            <Text style={{ color: 'white' }}>No highlights yet</Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={images}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.id)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
              initialScrollIndex={0}
            />
          )}
        </View>

        {/* Carousel navigation buttons */}
        <View style={styles.carouselNav}>
          <TouchableOpacity
            onPress={goToPrevious}
            disabled={activeIndex === 0}
            style={styles.navButton}
          >
            <Feather name="chevron-left" size={30} color={activeIndex === 0 ? 'gray' : 'white'} />
          </TouchableOpacity>
          <Text style={styles.activeIndexText}>{images.length > 0 ? `${activeIndex + 1} / ${images.length}` : '0 / 0'}</Text>
          <TouchableOpacity
            onPress={goToNext}
            disabled={activeIndex === images.length - 1}
            style={styles.navButton}
          >
            <Feather name="chevron-right" size={30} color={activeIndex === images.length - 1 ? 'gray' : 'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingLeft: 15,
    zIndex: 1,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginStart: '25%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rectangle: {
    width: width * 0.88,
    height: height * 0.5,
    backgroundColor: 'rgba(183, 226, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#73DBE5',
    borderWidth: 2,
    marginTop: height * 0.09,
    alignSelf: 'center',
  },
  carouselItem: {
    width: width, // Ensuring the image covers the full width
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  carouselNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 50,
  },
  activeIndexText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HighlightsScreen;
