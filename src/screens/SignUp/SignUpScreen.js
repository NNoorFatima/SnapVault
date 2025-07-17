import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';
import CustomBox from '../../components/CustomBox';
import CustomTextField from '../../components/CustomTextField';
import ClickableText from '../../components/ClickableText';
import CustomButton from '../../components/CustomButton';
import { launchCamera } from 'react-native-image-picker';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const {t} = useTranslation();
  const [email, setEmail] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState('fields'); // 'fields', 'camera', 'ready'

  // Validate fields
  const validateFields = () => {
    if (!email.trim() || !userEmail.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill all fields.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };
  // Camera capture handler
  const handleCaptureImage = async () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.5,
      saveToPhotos: false,
      includeBase64: false,
      presentationStyle: 'fullScreen',
      preferredCameraDevice: 'front',
    };
    const result = await launchCamera(options);
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
      setStep('ready');
      setError('');
    } else {
      setError('Image capture required.');
    }
  };
  // Registration handler
  const handleSignUp = async () => {
    if (!validateFields()) {
      setStep('fields');
      return;
    }
    if (!image) {
      setStep('camera');
      setError('Please capture your image to continue.');
      return;
    }
    // Send all info to backend (replace with your API call)
    const registrationData = {
      username: email,
      email: userEmail,
      password,
      confirmPassword,
      image,
    };
    // TODO: Replace with your actual API call
    // Example: await api.registerUser(registrationData);
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/signUp.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topRow}>
              <Image
                source={require('../../assets/Images/logo.png')}
                style={styles.leftLogo}
                resizeMode="contain"
              />
              <Text style={styles.signupTextLeft}>Create an Account</Text>
            </View>
            <CustomBox
              style={styles.customBox}
              backgroundColor="rgba(162, 207, 216, 0.45)"
              borderRadius={20}
            >
              {step === 'fields' && (
                <>
                  <CustomTextField
                    label={t('SignUp.name')}
                    placeholder={t('SignUp.namePlaceholder')}
                    value={email}
                    onChangeText={setEmail}
                    iconSource={require('../../assets/Icons/email.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#FFFFFF"
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 16, borderRadius: 10 }}
                  />
                  <CustomTextField
                    label={t('SignUp.email')}
                    placeholder={t('SignUp.emailPlaceholder')}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    iconSource={require('../../assets/Icons/email.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#FFFFFF"
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 8, borderRadius: 10 }}
                  />
                  <CustomTextField
                    label={t('SignUp.password')}
                    placeholder={t('SignUp.passwordPlaceholder')}
                    value={password}
                    onChangeText={setPassword}
                    iconSource={require('../../assets/Icons/lock.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#ffffff"
                    secureTextEntry
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 8, borderRadius: 10 }}
                    showVisibilityIcon={true}
                    isPassword={true}
                    isPasswordVisible={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                  />
                  <CustomTextField
                    label={t('SignUp.confirmPassword')}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    iconSource={require('../../assets/Icons/lock.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#ffffff"
                    secureTextEntry
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 8, borderRadius: 10 }}
                    showVisibilityIcon={true}
                    isPassword={true}
                    isPasswordVisible={showConfirmPassword}
                    onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  <CustomButton
                    buttonText={'Next: Capture Image'}
                    backgroundColor="#bee2e6ff"
                    width="100%"
                    height={50}
                    textColor="#1B1C41"
                    fontSize={20}
                    borderRadius={20}
                    onPress={() => {
                      if (validateFields()) {
                        setStep('camera');
                      }
                    }}
                    style={{ marginTop: 16 }}
                  />
                </>
              )}
              {step === 'camera' && (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                  <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
                    Please capture your image using the front camera
                  </Text>
                  <CustomButton
                    buttonText={'Open Camera'}
                    backgroundColor="#bee2e6ff"
                    width={80}
                    height={50}
                    textColor="#1B1C41"
                    fontSize={18}
                    borderRadius={20}
                    onPress={handleCaptureImage}
                  />
                  {error ? (
                    <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
                  ) : null}
                </View>
              )}
              {step === 'ready' && (
                <>
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#6BDCE1', marginBottom: 5 }}>Image captured!</Text>
                    <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                  </View>
                  <CustomButton
                    buttonText={t('SignUp.signUp')}
                    backgroundColor="#bee2e6ff"
                    width="100%"
                    height={50}
                    textColor="#1B1C41"
                    fontSize={20}
                    borderRadius={20}
                    onPress={handleSignUp}
                    style={{ marginTop: 16 }}
                  />
                  {error ? (
                    <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text>
                  ) : null}
                </>
              )}
            </CustomBox>
            <View style={styles.signInWrapperBox}>
              <ClickableText
                text={t('SignUp.alreadyUser')}
                color="#73DBE5"
                fontSize={18}
                onPress={() => navigation.navigate('SignIn')}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    marginTop: 35, // Added to move logo and text down
  },
  leftLogo: {
    width: 50,
    height: 50,
    alignSelf: 'flex-start',
    marginRight: 10,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  signupTextLeft: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
    marginLeft: 0,
    marginBottom: 0,
  },
  createAccountTextLeft: {
    fontSize: 30,
    color: '#6BDCE1',
    marginTop: 10,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  customBox: {
    width: '100%',
    padding: 20,
    height: 530,
    // backgroundColor and opacity are now set via props
    borderRadius: 20,
    marginTop: 20,
  },
  forgotWrapperBox: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  signInWrapperBox: {
    width: '100%',
    marginTop: 25,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
