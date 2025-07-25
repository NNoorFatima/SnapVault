import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Field from '../../components/EditProfileInput';
import Button from '../../components/Button';
import BackgroundImage from '../../assets/UserProfileBackground';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

const EditProfile = () => {
    const [email, setEmail] = useState('sample@gmail.com');
    const [username, setUsername] = useState('sample');
    const [bio, setBio] = useState('');
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <BackgroundImage />
            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
                <View style={styles.formBox}>
                    <Field label={t('editProfile.email')} icon={<Feather name="mail" size={20} color='#222831' />} value={email} onChangeText={setEmail} placeholder="sample@gmail.com" />
                    <Field label={t('editProfile.userName')} icon={<Feather name="user" size={20} color='#222831' />} value={username} onChangeText={setUsername} placeholder="Username" />
                    <Field label={t('editProfile.bio')} icon={<Feather name="edit-2" size={20} color='#222831' />} value={bio} onChangeText={setBio} placeholderTextColor='#000' placeholder="Description" />
                </View>
                <Button
                    title={t('editProfile.update')}
                    onPress={() => console.log('Button Pressed')}
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