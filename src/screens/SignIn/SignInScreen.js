import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import CustomBox from '../../components/CustomBox';
import CustomTextField from '../../components/CustomTextField';
import ClickableText from '../../components/ClickableText';
import CustomButton from '../../components/CustomButton';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation, onSignIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/Images/backpicture.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.titleTopLeft}>Sign In</Text>
            <Image
              source={require('../../assets/Images/logo.png')}
              style={styles.centerLogo}
              resizeMode="contain"
            />
            <Text style={styles.centerText}>Welcome to SnapVault</Text>

            <CustomBox
               style={styles.customBox}
              backgroundColor="rgba(162, 207, 216, 0.45)" // transparent background
              borderRadius={20}
            >
              <CustomTextField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                iconSource={require('../../assets/Icons/email.png')}
                inputTextColor="#fff"
                labelColor="#FFFFFF"
                placeholderColor="#6BDCE1"
                height={55}
                fontSize={20}
                style={{ marginBottom: 16, borderRadius: 10 }}
              />
              <CustomTextField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                iconSource={require('../../assets/Icons/lock.png')}
                inputTextColor="#fff"
                labelColor="#FFFFFF"
                placeholderColor="#6BDCE1"
                secureTextEntry
                height={55}
                fontSize={20}
                style={{ marginBottom: 8, borderRadius: 10 }}
              />
              <View style={styles.forgotWrapperBox}>
                <ClickableText
                  text="Forgot Password?"
                  color="#73DBE5"
                  fontSize={16}
                  onPress={() => navigation.navigate('ForgetPassword')}
                />
              </View>
              <CustomButton
                buttonText="Sign In"
                backgroundColor="#73DBE5"
                width="100%"
                height={50}
                textColor="#1B1C41"
                fontSize={20}
                borderRadius={20}
                onPress={() => onSignIn && onSignIn()}
                style={{ marginTop: 16 }}
              />
            </CustomBox>
            <View style={styles.signUpWrapperBox}>
                <ClickableText
                  text="New to SnapVault? SignUp"
                  color="#73DBE5"
                  fontSize={18}
                  onPress={() => navigation.navigate('SignUp')}
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
    backgroundColor: '#000', // fallback color in case image fails
    // Removed paddingTop to allow background image to cover the whole screen
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
});

export default SignInScreen;
