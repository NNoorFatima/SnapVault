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
//for localization
import { useTranslation } from 'react-i18next';


const Divider = () => <View style={styles.divider} />;
const UserCard = ({name, phone, email,avatar}: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    //for localization 
    const { t } = useTranslation();
    
    return (
        <View style={styles.card}>
            <View style={styles.centeredSection}>
                <Image source={avatar} style ={styles.avatar} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
            <Divider />
            <View style={styles.leftSection}>
                {/* Edit Profile */}
                <ProfileOption icon={<Feather name="edit-3" size={20} color='#222831' />} label={t('profile.editProfile')} 
                    onPress={() =>navigation.navigate('Edit Profile') } shouldFlip={true}/>
                {/* Change Password */}
                <ProfileOption icon={<Feather name="lock" size={20}  color='#222831'/>} label={t('profile.changePassword')} 
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
                <ProfileOption icon={<Feather name="log-out" size={20} color='#222831' />} label={t('profile.logout')} 
                    onPress={() => setShowLogoutPopup(true)} />
                    <Modal
                        visible={showLogoutPopup}
                        transparent
                        animationType="fade"
                        >
                        <ConfirmationPopUp
                            message={t('Logout.message')}
                            onCancel={() => setShowLogoutPopup(false)}  // just hide modal
                            onConfirm={() => {setShowLogoutPopup(false);
                            // perform logout logic here
                            }}
                        />
                        </Modal>    
                {/* Delete Acccount */}
                <ProfileOption icon={<Feather name="trash-2" size={20} color='#222831'/>} label={t('profile.deleteAccount')} 
                    onPress={() => setShowDeletePopup(true)} />
                    <Modal
                        visible={showDeletePopup}
                        transparent
                        animationType="fade"
                        >
                        <ConfirmationPopUp
                            message={t('DeleteAccount.message')}
                            onCancel={() => setShowDeletePopup(false)}  // just hide modal
                            onConfirm={() => {setShowDeletePopup(false);
                            // perform delete logic here
                            }}
                        />
                        </Modal>  
                {/* change language 
                <ProfileOption icon={<Feather name="globe" size={20} color="grey" />} label= {t('profile.changeLanguage')}
                    onPress={() => {
                    const newLang = i18n.language === 'en' ? 'ur' : 'en';
                    changeAppLanguage(newLang); //  calls RTL logic and restarts
                }}/> */}
            </View>
        </View>
    );
};



export default UserCard;