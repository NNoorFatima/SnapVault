import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions, 
  Image
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CustomTextField = ({
  label = 'Email',
  placeholder = 'Enter your email',
  width = '85%', // e.g. '85%' or 300
  height = 50,
  fontSize = 14,
  labelColor = '#1A1A4E',
  placeholderColor = '#6BDCE1',
  inputTextColor = '#000',
  borderBottomColor = '#6BDCE1',
  iconSource, // require('../assets/icons/email.png')
  iconSize = 20,
  onChangeText = () => {},
  value = '',
  style = {}
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width:
            typeof width === 'string'
              ? width
              : screenWidth * (width / 100),
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: labelColor, fontSize }]}>
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            height,
            borderBottomColor,
          },
        ]}
      >
        {iconSource && (
          <Image
            source={iconSource}
            style={{ width: iconSize, height: iconSize, marginRight: 8 }}
            resizeMode="contain"
          />
        )}
        <TextInput
          style={[styles.textInput, { color: inputTextColor, fontSize, flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    paddingBottom: 5,
  },
  textInput: {
    fontSize: 14,
  },
});

export default CustomTextField;