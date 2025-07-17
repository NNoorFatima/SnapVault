import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  iconName: string;
  iconColor?: string;
  textColor?: string;
  iconSize?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  iconName,
  iconColor = 'white',
  textColor = '#FFFFFF',
  iconSize = 23,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.buttonIconContainer}>
        <Feather name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});

export default ActionButton; 