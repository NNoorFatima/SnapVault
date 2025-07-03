import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView
} from 'react-native';


const { width, height } = Dimensions.get('window');

const SplashScreen = () => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/splash.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // fallback color in case image fails
    // Removed paddingTop to allow background image to cover the whole screen
  },
});

export default SplashScreen;
