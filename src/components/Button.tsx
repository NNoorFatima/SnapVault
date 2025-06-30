import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';


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
      style={[{
        backgroundColor,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: 17,
        marginRight:17,
      }, style]}
    >
      <Text style={[{ color: textColor, fontSize: 18, fontWeight: 'bold' }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;