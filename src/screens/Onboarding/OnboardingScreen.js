import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomBox from '../../components/CustomBox';


const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onFinish }) => {
  // Responsive vertical position for the info box
  // Keep the box a bit down
  const boxBottom = height * 0.05; // 5% from bottom
  const boxHeight = height * 0.28; // 28% of screen height
  // Position the continue button so it's half inside and half outside the box (touching the box)
  const buttonOffset = -34; // Half of button height (54/2), so it sits half in/half out

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/onboard.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Centered title heading */}
        <View style={styles.centerTitleWrapper}>
          <Text style={styles.centerTitle}>Best Free Photo Detector and Distributor</Text>
        </View>
        {/* Main overlay/title can go here if needed */}
        <CustomBox
          style={[
            styles.onboardBoxBottom,
            {
              bottom: boxBottom,
              height: boxHeight,
              left: 20,
              right: 20,
            },
          ]}
          backgroundColor="rgba(255,255,255,0.85)"
          borderRadius={20}
        >
          <Text style={styles.onboardBoxText}>SnapVault is an AI-powered photo-sharing app that uses facial recognition to automatically detect and sort images.
SnapVault simplifies sharing, protects privacy, and makes sure no memory gets lost.</Text>
          <View style={[styles.bottomCircleWrapperAbsolute, { bottom: buttonOffset }]}> 
            <TouchableOpacity onPress={onFinish}>
              <View style={styles.bottomCircle}>
                <Image
                  source={require('../../assets/Icons/continue.png')}
                  style={styles.circleIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </CustomBox>
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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  onboardBoxBottom: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.61)',
    borderRadius: 20,
    padding: 24,
    // left, right, bottom, height set dynamically
    // Remove static bottom and height
  },
  onboardBoxText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'left',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomCircleWrapperAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20, // Move the circle and icon a bit down by decreasing the bottom value
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    zIndex: 2,
  },
  bottomCircle: {
    width: 54, // was 70
    height: 54, // was 70
    borderRadius: 27, // was 35
    backgroundColor: '#18214C',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  circleIcon: {
    width: 54, // was 70
    height: 54, // was 70
    tintColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // Remove justifyContent and alignItems for free placement
  },
  titleTopLeft: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  centerLogo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  centerText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  customBox: {
    width: '100%',
    padding: 20,
    height: 430,
    // backgroundColor and opacity are now set via props
    borderRadius: 20,
    marginTop: 20,
  },
  forgotWrapperBox: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  signUpWrapperBox: {
    width: '100%',
    marginTop: 25,
    fontWeight: 'bold'
  },
  // Add styles for the centered title
  centerTitleWrapper: {
    position: 'absolute',
    top: height * 0.5 - 30, // Vertically center the title (subtract half the font size for better centering)
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  centerTitle: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left', // Left align the text
    alignSelf: 'flex-start', // Ensure left alignment within the wrapper
    width: '90%', // Prevent overflow and keep it visually balanced
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
  },
});

export default OnboardingScreen;
