import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ProfileOption from './ProfileOption';
import styles from './UserCard.styles';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';



const Divider = () => <View style={styles.divider} />;
const UserCard = ({name, phone, email,avatar}: any) => (
    <View style={styles.card}>
        <View style={styles.centeredSection}>
            <Image source ={{uri: avatar}} style ={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>{phone}</Text>
            <Text style={styles.email}>{email}</Text>
        </View>
        <Divider />
        <View style={styles.leftSection}>
            <ProfileOption icon={<Feather name="edit-3" size={20} color="grey" />} label="Edit Profile" onPress={() => {}} />
            <ProfileOption icon={<Feather name="lock" size={20}  color="grey"/>} label="Change Password" onPress={() => {}} />
            <ProfileOption icon={<Feather name="log-out" size={20} color="grey" />} label="Logout" onPress={() => {}} />
            <ProfileOption icon={<Feather name="trash-2" size={20} color="grey"/>} label="Delete Account" onPress={() => {}} />
        </View>
    </View>
);



export default UserCard;