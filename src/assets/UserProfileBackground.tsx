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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '110%',
  },
});

export default BackgroundImage;
