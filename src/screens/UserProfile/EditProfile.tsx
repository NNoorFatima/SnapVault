import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import Field from '../../components/EditProfileInput';
import Button from '../../components/Button'; // adjust path accordingly
import BackgroundImage from '../../assets/UserProfileBackground';
//for localization
import { useTranslation } from 'react-i18next';

// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
const EditProfile = () => {
    const [email,setEmail] = useState('sample@gmail.com');
    const [password,setPassword] = useState('password');
    const [username,setUsername] = useState('sample');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    //for localization 
    const { t } = useTranslation();
    return(
        <ScrollView>
            <BackgroundImage />
                <View style={{ marginTop:40, backgroundColor: 'white', borderRadius: 30,margin:10 }}>
                        <Field label={t('editProfile.email')} icon={<Feather name="mail" size={20} color="purple" />} value={email} onChangeText={setEmail} placeholder="sample@gmail.com" />
                        <Field label={t('editProfile.password')} icon={<Feather name="lock" size={20} color="purple" />} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
                        <Field label={t('editProfile.userName')} icon={<Feather name="user" size={20} color="purple" />} value={username} onChangeText={setUsername} placeholder="Username" />
                        <Field label={t('editProfile.phone')} icon={<Feather name="phone" size={20} color="purple" />} value={phone} onChangeText={setPhone} placeholder="Phone number" />
                        <Field label={t('editProfile.bio')} icon={<Feather name="edit-2" size={20} color="purple" />} value={bio} onChangeText={setBio} placeholder="Description" />
                </View>
                <Button
                    title={t('editProfile.update')}
                    onPress={() => console.log('Button Pressed')}
                    backgroundColor="#73DBE5"
                    textColor="black"
                />
        </ScrollView>




    );

    
};

export default EditProfile