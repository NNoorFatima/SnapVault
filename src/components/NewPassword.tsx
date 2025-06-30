import React, { useState } from 'react';
import { View, Text, TextInput,Modal  } from 'react-native';
import Button from './Button';
import styles from './NewPassword.styles';
import Logo from '../assets/Logo';


const NewPassword = ({ visible, onClose }: any) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            
            <View style={styles.overlay}>
                
                <View style={styles.container}>
                    <Logo
                        source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/q89N1k9dDd.png' }}
                    />

                    <Text style={styles.title}>Set New Password</Text>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput style={styles.input} secureTextEntry />
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput style={styles.input} secureTextEntry />
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            onPress={onClose}//should go back to the current screen 
                            textColor="black"
                            style={styles.cancelButton}
                        />
                        <Button
                            title="Confirm"
                            onPress={() => console.log('Button Pressed')} //should go to splash screen 
                            textColor="black"
                            style={styles.updateButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NewPassword;


