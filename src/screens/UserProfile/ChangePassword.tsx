import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Logo from '../../assets/Logo';
import { useTranslation } from 'react-i18next';
import { changePassword } from '../../store/slices/profileSlice';
import { AppDispatch } from '../../store/store';

const ChangePassword = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: any) => state.profile);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long');
            return;
        }

        try {
            const passwordData = {
                currentPassword,
                newPassword,
                confirmPassword
            };

            const result = await dispatch(changePassword(passwordData as any)).unwrap();

            Alert.alert('Success', 'Password changed successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to change password');
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Logo
                    source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/q89N1k9dDd.png' }}
                    style={{ marginBottom: 8, marginTop: -10, alignSelf: 'center' }}
                />
                <Text style={styles.snapVaultText}>SnapVault</Text>
                <Text style={styles.title}>{t('NewPassword.message')}</Text>
                
                <Text style={styles.label}>{t('NewPassword.currentPassword')}</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showCurrentPassword}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                        placeholderTextColor="#666"
                    />
                    <Text 
                        style={styles.visibilityToggle}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        {showCurrentPassword ? '👁️' : '🙈'}
                    </Text>
                </View>

                <Text style={styles.label}>{t('NewPassword.label1')}</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#666"
                    />
                    <Text 
                        style={styles.visibilityToggle}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? '👁️' : '🙈'}
                    </Text>
                </View>

                <Text style={styles.label}>{t('NewPassword.label2')}</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        placeholderTextColor="#666"
                    />
                    <Text 
                        style={styles.visibilityToggle}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? '👁️' : '🙈'}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('Button.cancel')}
                        onPress={handleCancel}
                        textColor="black"
                        style={styles.cancelButton}
                    />
                    <Button
                        title={loading ? 'Updating...' : t('Button.confirm')}
                        onPress={loading ? () => {} : handleChangePassword}
                        textColor="black"
                        style={loading ? { ...styles.updateButton, opacity: 0.6 } : styles.updateButton}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F1F51',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: '#1F1F51',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        padding: 20,
    },
    snapVaultText: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: 'white',
    },
    label: {
        fontSize: 14,
        marginTop: 10,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 8,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    visibilityToggle: {
        fontSize: 16,
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: '#73DBE5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: '#D7EDEF',
    },
});

export default ChangePassword; 