import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
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
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [localError, setLocalError] = React.useState('');
  const [step, setStep] = React.useState('fields'); // 'fields', 'camera', 'ready'

  // Validate fields
  const validateFields = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setLocalError('Please fill all fields.');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return false;
    }
    
    setLocalError('');
    return true;
  };

  // Camera capture handler
  const handleCaptureImage = async () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.8,
      saveToPhotos: false,
      includeBase64: false,
      presentationStyle: 'fullScreen',
      preferredCameraDevice: 'front',
    };
    
    try {
      const result = await launchCamera(options);
      
      // Check if user cancelled
      if (result.didCancel) {
        setLocalError('Image capture is required to continue.');
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        
        // Validate image size (max 10MB)
        if (capturedImage.fileSize && capturedImage.fileSize > 10 * 1024 * 1024) {
          setLocalError('Image size must be less than 10MB.');
          return;
        }
        
        // Validate image type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(capturedImage.type)) {
          setLocalError('Please select a JPEG or PNG image.');
          return;
        }
        
        setImage(capturedImage);
        setStep('ready');
        setLocalError('');
      } else {
        setLocalError('Image capture required.');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setLocalError('Failed to capture image. Please try again.');
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
      setLocalError('Please capture your image to continue.');
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        profilePicture: {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'profile.jpg',
        },
      };

      console.log('🔄 Starting registration with data:', {
        name: registrationData.name,
        email: registrationData.email,
        imageType: registrationData.profilePicture.type,
        imageName: registrationData.profilePicture.name,
      });

      // Dispatch registration action
      const result = await dispatch(registerUser(registrationData));
      
      if (registerUser.fulfilled.match(result)) {
        // Registration successful
        Alert.alert(
          'Success!',
          'Account created successfully! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form data
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setImage(null);
                setStep('fields');
                // Navigate to login
                navigation.navigate('SignIn');
              },
            },
          ]
        );
      } else {
        // Registration failed
        const errorMessage = result.payload || 'Registration failed. Please try again.';
        setLocalError(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  // Clear error when user starts typing
  const clearErrorOnInput = () => {
    if (localError) setLocalError('');
    if (error) dispatch({ type: 'auth/clearError' });
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
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      clearErrorOnInput();
                    }}
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
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearErrorOnInput();
                    }}
                    iconSource={require('../../assets/Icons/email.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#FFFFFF"
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 8, borderRadius: 10 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <CustomTextField
                    label={t('SignUp.password')}
                    placeholder={t('SignUp.passwordPlaceholder')}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearErrorOnInput();
                    }}
                    iconSource={require('../../assets/Icons/lock.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#ffffff"
                    secureTextEntry={!showPassword}
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
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearErrorOnInput();
                    }}
                    iconSource={require('../../assets/Icons/lock.png')}
                    inputTextColor="#fff"
                    labelColor="#FFFFFF"
                    placeholderColor="#ffffff"
                    secureTextEntry={!showConfirmPassword}
                    height={55}
                    fontSize={20}
                    style={{ marginBottom: 8, borderRadius: 10 }}
                    showVisibilityIcon={true}
                    isPassword={true}
                    isPasswordVisible={showConfirmPassword}
                    onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  
                  {/* Error Display */}
                  {(localError || error) && (
                    <Text style={styles.errorText}>
                      {localError || error}
                    </Text>
                  )}
                  
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
                  <CustomButton
                    buttonText={'Back'}
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    width={80}
                    height={40}
                    textColor="#fff"
                    fontSize={16}
                    borderRadius={20}
                    onPress={() => setStep('fields')}
                    style={{ marginTop: 16 }}
                  />
                  {localError ? (
                    <Text style={styles.errorText}>{localError}</Text>
                  ) : null}
                </View>
              )}
              
              {step === 'ready' && (
                <>
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#6BDCE1', marginBottom: 5 }}>Image captured!</Text>
                    <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                    <CustomButton
                      buttonText={'Retake Photo'}
                      backgroundColor="rgba(255, 255, 255, 0.2)"
                      width={120}
                      height={35}
                      textColor="#fff"
                      fontSize={14}
                      borderRadius={15}
                      onPress={() => setStep('camera')}
                      style={{ marginTop: 8 }}
                    />
                  </View>
                  
                  {/* Error Display */}
                  {(localError || error) && (
                    <Text style={styles.errorText}>
                      {localError || error}
                    </Text>
                  )}
                  
                  <CustomButton
                    buttonText={loading ? 'Creating Account...' : t('SignUp.signUp')}
                    backgroundColor="#bee2e6ff"
                    width="100%"
                    height={50}
                    textColor="#1B1C41"
                    fontSize={20}
                    borderRadius={20}
                    onPress={handleSignUp}
                    disabled={loading}
                    style={{ marginTop: 16 }}
                  />
                  
                  {loading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#6BDCE1" />
                      <Text style={styles.loadingText}>Creating your account...</Text>
                    </View>
                  )}
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
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    color: '#6BDCE1',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SignUpScreen;
