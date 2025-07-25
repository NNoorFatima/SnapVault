import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Field from '../../components/EditProfileInput';
import Button from '../../components/Button';
import BackgroundImage from '../../assets/UserProfileBackground';
import { useTranslation } from 'react-i18next';
import { getUserService } from '../../api/ApiFactory';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

type UserProfileData = {
  email?: string;
  name?: string;
  bio?: string;
};

const EditProfile = () => {
    // TODO: Email field temporarily commented out - DO NOT REMOVE
    // Email update requires password verification which needs to be implemented
    // const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    // TODO: Email field temporarily commented out - DO NOT REMOVE
    // const [initial, setInitial] = useState<{ email: string; username: string; bio: string }>({ email: '', username: '', bio: '' });
    const [initial, setInitial] = useState<{ username: string; bio: string }>({ username: '', bio: '' });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const userService = getUserService();
                const profile: UserProfileData = await userService.getProfile();
                // TODO: Email field temporarily commented out - DO NOT REMOVE
                // setEmail(profile.email || '');
                setUsername(profile.name || '');
                setBio(profile.bio || '');
                // TODO: Email field temporarily commented out - DO NOT REMOVE
                // setInitial({ email: profile.email || '', username: profile.name || '', bio: profile.bio || '' });
                setInitial({ username: profile.name || '', bio: profile.bio || '' });
            } catch (err) {
                Alert.alert('Error', 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        setUpdating(true);
        const userService = getUserService();
        let anyChanged = false;
        try {
            // TODO: Email field temporarily commented out - DO NOT REMOVE
            // Email update requires password verification which needs to be implemented
            // if (email !== initial.email) {
            //     // If backend requires password, prompt for it here (not implemented)
            //     await userService.updateEmail({ email, password: 'dummyPassword' }); // TODO: prompt for password
            //     anyChanged = true;
            // }
            // Update username if changed
            if (username !== initial.username) {
                await userService.updateName(username);
                anyChanged = true;
            }
            // Update bio if changed
            if (bio !== initial.bio) {
                await userService.updateBio(bio);
                anyChanged = true;
            }
            if (anyChanged) {
                Alert.alert('Success', 'Profile updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate back to Profile screen
                            navigation.goBack();
                        }
                    }
                ]);
                // TODO: Email field temporarily commented out - DO NOT REMOVE
                // setInitial({ email, username, bio });
                setInitial({ username, bio });
            } else {
                Alert.alert('No changes', 'No fields were changed.');
            }
        } catch (err) {
            let message = 'Failed to update profile';
            if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
                message = (err as any).message;
            }
            Alert.alert('Error', message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
                <BackgroundImage />
                <ActivityIndicator size="large" color="#73DBE5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackgroundImage />
            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.formBox}>
                    {/* TODO: Email field temporarily commented out - DO NOT REMOVE
                    Email update requires password verification which needs to be implemented
                    <Field label={t('editProfile.email')} icon={<Feather name="mail" size={20} color='#222831' />} value={email} onChangeText={setEmail} placeholder="sample@gmail.com" />
                    */}
                    <Field label={t('editProfile.userName')} icon={<Feather name="user" size={20} color='#222831' />} value={username} onChangeText={setUsername} placeholder="Username" />
                    <Field label={t('editProfile.bio')} icon={<Feather name="edit-2" size={20} color='#222831' />} value={bio} onChangeText={setBio} placeholderTextColor='#000' placeholder="Description" />
                </View>
                <Button
                    title={updating ? t('editProfile.updating') || 'Updating...' : t('editProfile.update')}
                    onPress={handleUpdate}
                    backgroundColor="#73DBE5"
                    textColor="black"
                    style={styles.button}
                />
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
    formBox: {
        backgroundColor: 'rgba(141, 184, 188, 0.9)',
        borderRadius: 30,
        width: '90%',
        padding: '5%',
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',
    },
});

export default EditProfile;