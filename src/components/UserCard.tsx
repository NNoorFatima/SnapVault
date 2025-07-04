import React, { useState } from 'react';
import { View, Text, Image,Modal } from 'react-native';
import ProfileOption from './ProfileOption';
import styles from './UserCard.styles';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
//used for navigation among pages 
import { useNavigation } from '@react-navigation/native'; 
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
//for popup
import ConfirmationPopUp from './ConfirmationPopUp';
import NewPassword from './NewPassword';

const Divider = () => <View style={styles.divider} />;
const UserCard = ({name, phone, email,avatar}: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);

    return (
        <View style={styles.card}>
            <View style={styles.centeredSection}>
                <Image source ={{uri: avatar}} style ={styles.avatar} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
            <Divider />
            <View style={styles.leftSection}>
                {/* Edit Profile */}
                <ProfileOption icon={<Feather name="edit-3" size={20} color="grey" />} label="Edit Profile" 
                    onPress={() =>navigation.navigate('EditProfile')} />
                {/* Change Password */}
                <ProfileOption icon={<Feather name="lock" size={20}  color="grey"/>} label="Change Password" 
                    onPress={() => setShowPasswordPopup(true)}/>
                    <Modal
                        visible={showPasswordPopup}
                        transparent
                        animationType="fade"
                        >
                        <NewPassword
                            visible={true}
                            onClose={() => setShowPasswordPopup(false)}
                            onUpdate={(newPassword:string) => {
                            setShowPasswordPopup(false);
                            // handle password update logic here
                            console.log('Updated password:', newPassword);
                            }}
                        />
                    </Modal>

                {/* Logout */}
                <ProfileOption icon={<Feather name="log-out" size={20} color="grey" />} label="Logout" 
                    onPress={() => setShowLogoutPopup(true)} />
                    <Modal
                        visible={showLogoutPopup}
                        transparent
                        animationType="fade"
                        >
                        <ConfirmationPopUp
                            message="Are you sure you want to logout?"
                            onCancel={() => setShowLogoutPopup(false)}  // just hide modal
                            onConfirm={() => {setShowLogoutPopup(false);
                            // perform logout logic here
                            }}
                        />
                        </Modal>    
                {/* Delete Acccount */}
                <ProfileOption icon={<Feather name="trash-2" size={20} color="grey"/>} label="Delete Account" 
                    onPress={() => setShowDeletePopup(true)} />
                    <Modal
                        visible={showDeletePopup}
                        transparent
                        animationType="fade"
                        >
                        <ConfirmationPopUp
                            message="Are you sure you want to delete your account?"
                            onCancel={() => setShowDeletePopup(false)}  // just hide modal
                            onConfirm={() => {setShowDeletePopup(false);
                            // perform delete logic here
                            }}
                        />
                        </Modal>    
            </View>
        </View>
    );
};



export default UserCard;