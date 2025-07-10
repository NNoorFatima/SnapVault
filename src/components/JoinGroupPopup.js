import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';

const JoinGroupPopup = ({ visible, onClose, onGroupJoined }) => {
  const [groupCode, setGroupCode] = useState('');

  const handleJoin = () => {
    if (!groupCode.trim()) {
      Alert.alert('Error', 'Please enter a group code');
      return;
    }

    // Here you would typically make an API call to join the group
    // For now, we'll just call the callback
    onGroupJoined({
      code: groupCode.trim(),
    });

    // Reset form
    setGroupCode('');
    onClose();
  };

  const handleClose = () => {
    setGroupCode('');
    onClose();
  };

  const isFormValid = groupCode.trim();
  const {t} = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        
        <View style={{borderRadius: 20,
          overflow: 'hidden', // Ensures the background image respects the border radius
          width: '100%',
          maxWidth: 400, // Optional: limit the width of the popup
          padding: 0, // Remove padding to let the background image fill the container
        }}>
          <ImageBackground
          source={require('../assets/Images/popup-background-img.png')}   
        >
          
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('JoinGroup.heading')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('JoinGroup.code')}</Text>
              <TextInput
                style={styles.input}
                value={groupCode}
                onChangeText={setGroupCode}
                placeholder={t('JoinGroup.desc')}
                placeholderTextColor="#9CA3AF"
                maxLength={10}
                autoCapitalize="characters"
              />
            </View>
            
            <Text style={styles.helperText}>
              {t('JoinGroup.helperText')}
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{t('Button.cancel')}</Text>
            </TouchableOpacity>
            
            {isFormValid && (
              <TouchableOpacity
                style={[styles.button, styles.joinButton]}
                onPress={handleJoin}
              >
                <Text style={styles.joinButtonText}>{t('Button.join')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupContainer: {
    //backgroundColor: '#1F2937',
    
    padding: 24,
    width: '100%',
    maxWidth: 400,  
  }, 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#000000',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
    textAlign: 'center',
    letterSpacing: 2,
  },
  helperText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {  
    backgroundColor: 'rgba(0, 0, 0, 1)', 
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: 'rgb(255, 255, 255)', // Blue-500 with opacity
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinGroupPopup; 