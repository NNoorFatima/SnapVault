
// components/ContactCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ContactCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundColor: string;
  iconBackgroundColor: string;
  onPress?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  title,
  description,
  icon,
  backgroundColor,
  iconBackgroundColor, 
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 60,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 20,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#d1d5db',
    fontSize: 14,
  },
});

export default ContactCard;
