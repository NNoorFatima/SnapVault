import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClickableText = ({
  text = 'Click Me',
  fontSize = 16,
  color = '#007AFF',
  textAlign = 'center',
  fontWeight = 'normal',
  onPress = () => {},
  style = {},
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={[
          styles.text,
          { fontSize, color, textAlign, fontWeight },
          style,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 5,
  },
});

export default ClickableText;
