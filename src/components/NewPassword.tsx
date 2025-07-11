import React, { useState } from 'react';
import { View, Text, TextInput,Modal  } from 'react-native';
import Button from './Button';
import styles from './NewPassword.styles';
import Logo from '../assets/Logo';
//for localization  
import { useTranslation } from 'react-i18next';


const NewPassword = ({ visible, onClose }: any) => {
    //for localization
    const { t } = useTranslation();
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                {/* <Logo
                    source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/q89N1k9dDd.png' }}
                    style={{ marginBottom: 8, marginTop: -16, alignSelf: 'center' }}
                />
                <Text style={[styles.snapVaultText, { alignSelf: 'center', marginBottom: 12 }]}>SnapVault</Text> */}
                <View style={styles.container}>
                    <Logo
                    source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/q89N1k9dDd.png' }}
                    style={{ marginBottom: 8, marginTop: -10, alignSelf: 'center' }}
                    />
                    <Text style={[styles.snapVaultText, { alignSelf: 'center', marginBottom: 12 }]}>SnapVault</Text>
                    <Text style={styles.title}>{t('NewPassword.message')}</Text>
                    <Text style={styles.label}>{t('NewPassword.label1')}</Text>
                    <TextInput style={styles.input} secureTextEntry />
                    <Text style={styles.label}>{t('NewPassword.label2')}</Text>
                    <TextInput style={styles.input} secureTextEntry />
                    <View style={styles.buttonContainer}>
                        <Button
                            title={t('Button.cancel')}
                            onPress={onClose}//should go back to the current screen 
                            textColor="black"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={t('Button.confirm')}
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


