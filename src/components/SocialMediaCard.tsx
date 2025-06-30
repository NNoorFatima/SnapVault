// components/SocialMediaCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SocialMediaCardProps {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    marginRight: 16,
  },
  title: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SocialMediaCard;