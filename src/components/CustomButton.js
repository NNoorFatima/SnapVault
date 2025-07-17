import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CustomButton = ({
  buttonText = 'Sign In',
  backgroundColor = '#6BDCE1',
  width = '80%',              // can also be number like 200
  height = 50,
  textColor = '#000000',
  fontSize = 16,
  borderRadius = 20,
  onPress = () => {},
  style = {},
  isLoading = false,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width: typeof width === 'string' ? width : screenWidth * (width / 100),
          height,
          borderRadius,
          opacity: (isLoading || disabled) ? 0.6 : 1,
        },
        style
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontSize, fontWeight: 'bold' }}>
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default CustomButton;
