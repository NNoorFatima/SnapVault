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

const CreateGroupPopup = ({ visible, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (!groupDescription.trim()) {
      Alert.alert('Error', 'Please enter a group description');
      return;
    }

    // Here you would typically make an API call to create the group
    // For now, we'll just call the callback
    onGroupCreated({
      name: groupName.trim(),
      description: groupDescription.trim(),
    });

    // Reset form
    setGroupName('');
    setGroupDescription('');
    onClose();
  };

  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    onClose();
  };

  const isFormValid = groupName.trim() && groupDescription.trim();
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
            <Text style={styles.title}>{t('CreateGroup.heading')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('CreateGroup.name')}</Text>
              <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder={t('CreateGroup.desc')}
                placeholderTextColor="#9CA3AF"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('CreateGroup.grpDesc')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={groupDescription}
                onChangeText={setGroupDescription}
                placeholder={t('CreateGroup.desc')}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{t('Button.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                isFormValid ? styles.createButton : styles.createButtonDisabled
              ]}
              onPress={isFormValid ? handleCreate : undefined}
              disabled={!isFormValid}
            >
              <Text style={[
                isFormValid ? styles.createButtonText : styles.createButtonTextDisabled
              ]}>
                {t('Button.create')}
              </Text>
            </TouchableOpacity>
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
    marginBottom: 20,
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
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  createButton: {
    backgroundColor: 'rgb(255, 255, 255)', // White background like Join button
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Disabled white background
  },
  createButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: 'rgba(0, 0, 0, 0.5)', // Disabled text color
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateGroupPopup;