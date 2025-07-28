import React, { useState } from 'react';
import { View, Text, Image,Modal } from 'react-native';
import ProfileOption from './ProfileOption';
import styles from './UserCard.styles';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather'; //for icons
//used for navigation among pages 
import { useNavigation } from '@react-navigation/native'; 
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
//for popup
import ConfirmationPopUp from './ConfirmationPopUp';
//for localization
import { useTranslation } from 'react-i18next';
//for Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';



const Divider = () => <View style={styles.divider} />;
const UserCard = ({name, email, avatar, bio}: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    //for localization 
    const { t } = useTranslation();
    
    
    return (
        <View style={styles.card}>
            <View style={styles.centeredSection}>
                <Image source={avatar} style={styles.avatar} resizeMode="cover" />
                <Text style={styles.name}>{name}</Text>
                {bio ? (
                  <Text style={styles.bio} numberOfLines={2} ellipsizeMode="tail">{bio}</Text>
                ) : null}
                <Text style={styles.email}>{email}</Text>
            </View>
            <Divider />
            <View style={styles.leftSection}>
                {/* Edit Profile */}
                <ProfileOption icon={<Feather name="edit-3" size={20} color='#222831' />} label={t('profile.editProfile')} 
                    onPress={() =>navigation.navigate('Edit Profile') } shouldFlip={true}/>
                {/* Change Password */}
                <ProfileOption icon={<Feather name="lock" size={20}  color='#222831'/>} label={t('profile.changePassword')} 
                    onPress={() => navigation.navigate('Change Password')}/>

                   
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
                            onConfirm={async () => {
                                setShowLogoutPopup(false);
                                try {
                                    await dispatch(logoutUser());
                                    navigation.navigate('Auth');
                                } catch (error) {
                                    console.error('Logout failed:', error);
                                    // Still navigate to auth even if logout fails
                                    navigation.navigate('Auth');
                                }
                            }}
                        />
                        </Modal> 
            </View>
        </View>
    );
};



export default UserCard;