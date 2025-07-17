import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  View,
  Text
} from 'react-native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const {t}=useTranslation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/Splashagain.jpg')}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        <View style={styles.centeredContent}>
          <Text style={styles.title}>SnapVault</Text>
          <Text style={styles.subtitle}>{t('Splash.subtitle')}</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // fallback color in case image fails
    // Removed paddingTop to allow background image to cover the whole screen
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '73%', // was 13%, now 22% to bring content a bit down
    marginBottom: 0,
  },
  title: {
    fontSize: 44,
    fontWeight: '900', // was 'bold', now extra bold
    color: '#18214C', // dark blue
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#18214C',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.85,
  },
});

export default SplashScreen;
