// BackgroundImage.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const BackgroundImage = () => (
  <Image
    source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/8fSYqEOiwv.png' }}
    style={styles.background}
    resizeMode="cover"
  />
);

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default BackgroundImage;
