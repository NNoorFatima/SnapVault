import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import Field from '../../components/EditProfileInput';
import Button from '../../components/Button'; // adjust path accordingly
import BackgroundImage from '../../assets/UserProfileBackground';


// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
const EditProfile = () => {
    const [email,setEmail] = useState('sample@gmail.com');
    const [password,setPassword] = useState('password');
    const [username,setUsername] = useState('sample');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    return(
        <ScrollView>
            <BackgroundImage />
                <View style={{ marginTop:40, backgroundColor: 'white', borderRadius: 30,margin:10 }}>
                        <Field label="Email" icon={<Feather name="mail" size={20} color="purple" />} value={email} onChangeText={setEmail} placeholder="sample@gmail.com" />
                        <Field label="Password" icon={<Feather name="lock" size={20} color="purple" />} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
                        <Field label="Username" icon={<Feather name="user" size={20} color="purple" />} value={username} onChangeText={setUsername} placeholder="Username" />
                        <Field label="Phone" icon={<Feather name="phone" size={20} color="purple" />} value={phone} onChangeText={setPhone} placeholder="Phone number" />
                        <Field label="Bio" icon={<Feather name="edit-2" size={20} color="purple" />} value={bio} onChangeText={setBio} placeholder="Description" />
                </View>
                <Button
                    title="Update"
                    onPress={() => console.log('Button Pressed')}
                    backgroundColor="#73DBE5"
                    textColor="black"
                />
        </ScrollView>




    );

    
};

export default EditProfile