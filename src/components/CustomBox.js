import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomBox = ({
  width = '90%',
  height = 200,
  backgroundColor = '#B3E5FC',
  borderRadius = 15,
  opacity = 1,              // ✅ NEW: default semi-transparent
  style = {},
  children,
}) => {
  const boxWidth =
    typeof width === 'string' ? width : screenWidth * (width / 100);
  const boxHeight =
    typeof height === 'string' ? height : screenHeight * (height / 100);

  return (
    <View
      style={[
        {
          width: boxWidth,
          height: boxHeight,
          backgroundColor,
          borderRadius,
          opacity, // ✅ apply opacity here
        },
        styles.box,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomBox;
