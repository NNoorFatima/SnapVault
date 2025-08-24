import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Logo from '../../assets/Logo';
import BackgroundImage from '../../assets/UserProfileBackground';
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
            <BackgroundImage />
            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Logo
                        source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-27/q89N1k9dDd.png' }}
                        style={{ marginBottom: 8, marginTop: -10, alignSelf: 'center' }}
                    />
                    <Text style={styles.snapVaultText}>SnapVault</Text>
                    <Text style={styles.title}>{t('NewPassword.message')}</Text>
                    
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>{t('NewPassword.currentPassword')}</Text>
                        <View style={styles.inputRow}>
                            <Image
                                source={require('../../assets/Icons/lock.png')}
                                style={{ width: 20, height: 20, tintColor: '#222831' }}
                                resizeMode="contain"
                            />
                            <TextInput 
                                style={styles.inputField} 
                                secureTextEntry={!showCurrentPassword}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                                <Image
                                    source={showCurrentPassword
                                      ? require('../../assets/Icons/unlocked.png')
                                      : require('../../assets/Icons/locked.png')}
                                    style={{ width: 22, height: 22, tintColor: '#6BDCE1' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>{t('NewPassword.label1')}</Text>
                        <View style={styles.inputRow}>
                            <Image
                                source={require('../../assets/Icons/lock.png')}
                                style={{ width: 20, height: 20, tintColor: '#222831' }}
                                resizeMode="contain"
                            />
                            <TextInput 
                                style={styles.inputField} 
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                <Image
                                    source={showNewPassword
                                      ? require('../../assets/Icons/unlocked.png')
                                      : require('../../assets/Icons/locked.png')}
                                    style={{ width: 22, height: 22, tintColor: '#6BDCE1' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>{t('NewPassword.label2')}</Text>
                        <View style={styles.inputRow}>
                            <Image
                                source={require('../../assets/Icons/lock.png')}
                                style={{ width: 20, height: 20, tintColor: '#222831' }}
                                resizeMode="contain"
                            />
                            <TextInput 
                                style={styles.inputField} 
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Image
                                    source={showConfirmPassword
                                      ? require('../../assets/Icons/unlocked.png')
                                      : require('../../assets/Icons/locked.png')}
                                    style={{ width: 22, height: 22, tintColor: '#6BDCE1' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent',
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    content: {
        backgroundColor: 'rgba(141, 184, 188, 0.9)',
        borderRadius: 30,
        width: '90%',
        maxWidth: 400,
        padding: '5%',
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
    inputWrapper: {
        marginBottom: 16,
        marginTop: 15,
        marginLeft: 30,
        width: '85%',
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 4,
        color: '#222831',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#6BDCE1',
        paddingBottom: 6,
    },
    inputField: {
        color: '#222831',
        marginLeft: 10,
        flex: 1,
        fontSize: 14,
        paddingVertical: 6,
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