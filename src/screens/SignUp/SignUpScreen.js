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
import { ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ onBack, onSignIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
            <Text style={styles.signupTextLeft}>Sign Up</Text>
          </View>
          <Text style={styles.createAccountTextLeft}>Create a new account</Text>

          <CustomBox
            style={styles.customBox}
            backgroundColor="rgba(162, 207, 216, 0.45)" // transparent background
            borderRadius={20}
          >
            <CustomTextField
              label="Username"
              placeholder="Enter your username"
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
              label="Email"
              placeholder="Enter your email"
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

            <CustomTextField
              label="Confirm Password"
              placeholder="Confirm your password"
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

            <CustomButton
              buttonText="Sign Up"
              backgroundColor="#73DBE5"
              width="100%"
              height={50}
              textColor="#1B1C41"
              fontSize={20}
              borderRadius={20}
              onPress={() => {}}
              style={{ marginTop: 16 }}
            />
          </CustomBox>
          <View style={styles.signInWrapperBox}>
            <ClickableText
              text="Already have an account? Sign In"
              color="#73DBE5"
              fontSize={18}
              onPress={onSignIn}
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
    // Removed alignItems: 'center' for left alignment
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
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
