import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ContactHeaderProps {
  onBackPress: () => void;
}

const ContactHeader: React.FC<ContactHeaderProps> = ({ onBackPress }) => {
  return (
    <LinearGradient
      colors={['#A300AB', '#00A2B9']} // Purple to cyan gradient
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7} // Subtle press effect
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💎</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.description}>
            Let us know how we can support your backup and archiving needs!
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    position: 'absolute' as const,
    top: 10,
    left: 24,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  backButtonText: {
    color: 'white',
    fontSize: 22, // Slightly larger for clarity
    fontWeight: 'bold' as const,
    lineHeight: 24, // Ensure proper vertical alignment
  },
  content: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 32,
    gap: 16,
  },
  iconContainer: {
    padding: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    width: 56,
    height: 56,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginBottom: 8,
  },
  description: {
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ContactHeader;