import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import CustomBox from '../../components/CustomBox';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/forget.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow} pointerEvents="box-none">
            <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.navigate('SignIn')}>
              <Image
                source={require('../../assets/Icons/backarrow.png')}
                style={styles.backButtonIcon}
                resizeMode="contain"
                onError={(e) => console.log('Back icon failed to load', e.nativeEvent)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleRow}>
            <Image
              source={require('../../assets/Images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <CustomBox
            style={styles.onboardBoxBottom}
            backgroundColor="rgba(255,255,255,0.85)"
            borderRadius={20}
          >
            <Text style={styles.resetTitle}>{t('ResetPassword.message')}</Text>
            <Text style={styles.resetDescription}>
              {t('ResetPassword.emailMsg')}
            </Text>
            <CustomTextField
              label={t('ResetPassword.emailAddress')}
              placeholder={t('ResetPassword.emailPlaceholder')}
              width={"100%"}
              height={60}
              fontSize={18}
              labelColor="#1A1A4E"
              placeholderColor="#ffffff"
              inputTextColor="#000"
              iconSource={require('../../assets/Icons/email.png')}
              iconSize={26}
              onChangeText={setEmail}
              value={email}
              style={{ marginBottom: 16, borderRadius: 12 }}
            />

            
          <CustomButton
              buttonText={t('ResetPassword.instructions')}
              backgroundColor="#6BDCE1"
              width={80}
              height={45}
              textColor="#1A1A1A"
              fontSize={22}
              borderRadius={25}
              onPress={() => console.log('Button Pressed')}
          />

          </CustomBox>
        </ScrollView>
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
    width: width,
    height: height,
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 10,
    paddingTop: 16,
  },
  titleRow: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9,
  },
  backButtonWrapper: {
    position: 'absolute',
    left: 16,
    top: 16,
    // marginTop: 12, // Remove this to avoid pushing the icon down too far
    zIndex: 11,
    backgroundColor: 'rgba(0,0,0,0.3)', // Add a subtle background for visibility
    borderRadius: 20,
    padding: 4,
  },
  backButtonIcon: {
    width: 32,
    height: 32,
    tintColor: '#fff',
    backgroundColor: 'transparent',
  },
  logo: {
    width: 90,
    height: 90,
  },
  snapvaultTitle: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  centerBoxWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  customBoxOverride: {
    marginTop: 260,
    minHeight: 260,
    maxHeight: 480,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
  },
  resetTitle: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  resetDescription: {
    fontSize: 20,
    color: '#0a1a4f',
    textAlign: 'left',
    marginTop: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
   onboardBoxBottom: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 100,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(142, 174, 202, 0.77)',
    borderRadius: 20,
    height: 440, // Increased height
  },
  onboardBoxText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'left',
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
