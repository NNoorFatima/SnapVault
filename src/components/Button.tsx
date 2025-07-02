import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle,StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#00A5B5',
  textColor = '#fff',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, { backgroundColor }, style]} >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 17,
    marginRight:17,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
