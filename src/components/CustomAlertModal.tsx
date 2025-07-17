import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ImageBackground } from 'react-native';

interface CustomAlertModalProps {
  visible: boolean; // Controls the visibility of the modal
  title: string;    // The title of the alert
  message: string;  // The message content of the alert
  onClose: () => void; // Function to call when the alert is dismissed
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true} // Allows the overlay to show through
      animationType="fade" // Smooth fade animation
      onRequestClose={onClose} // Handles hardware back button on Android
    >
      <View style={styles.overlay}>
        {/* ImageBackground for the alert's background, similar to JoinGroupPopup */}
        <ImageBackground
          source={require('../assets/Images/popup-background-img.png')} // Ensure this path is correct
          style={styles.backgroundImage} // Style for the ImageBackground
          imageStyle={styles.backgroundImageStyle} // Style applied to the image itself
          resizeMode="stretch" // Stretches the image to cover the container
        >
          <View style={styles.alertContainer}>
            {/* Alert Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Alert Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Dismiss Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={onClose} // Calls the onClose prop to dismiss the modal
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Horizontal padding for smaller screens
  },
  backgroundImage: {
    width: '100%', // Take full width of its parent (which is limited by maxWidth in overlay)
    maxWidth: 400, // Optional: limit the width of the popup, consistent with JoinGroupPopup
    borderRadius: 20, // Rounded corners for the background image container
    overflow: 'hidden', // Ensures the background image respects the border radius
    justifyContent: 'center', // Center content vertically within the image background
    alignItems: 'center', // Center content horizontally within the image background
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8, // Android shadow
  },
  backgroundImageStyle: {
    borderRadius: 20, // Apply border radius directly to the image
  },
  alertContainer: {
    // No background color here, as ImageBackground provides it
    borderRadius: 20, // Rounded corners, consistent with ImageBackground
    padding: 24, // Inner padding
    width: '100%', // Occupy full width of the ImageBackground container
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  title: {
    color: '#FFFFFF', // White title text
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12, // Space below title
    textAlign: 'center', // Center align title text
  },
  message: {
    color: '#E5E7EB', // Light gray message text
    fontSize: 16,
    textAlign: 'center', // Center align message text
    marginBottom: 24, // Space below message
    lineHeight: 22, // Improve readability
  },
  button: {
    backgroundColor: '#FFFFFF', // White button background
    borderRadius: 12, // Rounded button corners, slightly larger for consistency
    paddingVertical: 14, // Increased padding for a larger touch target
    paddingHorizontal: 30,
    minWidth: 120, // Minimum width for the button
    alignItems: 'center', // Center text horizontally within button
    justifyContent: 'center',
    marginTop: 10, // Space above the button
    shadowColor: '#000', // Button shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#000000', // Black button text for contrast
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CustomAlertModal;
