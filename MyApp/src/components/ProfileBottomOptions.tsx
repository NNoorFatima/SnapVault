import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ProfileOption from './ProfileOption';
// import styles from './UserCard.styles';

// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
const ProfileBottomOptions = () => (
    <View style={styles.card}>
        <View style={styles.leftSection}>
            <ProfileOption icon={<Feather name="phone-call" size={20} color="grey" />} label="Contact Us" onPress={() => {}} />
            <ProfileOption icon={<Feather name="alert-circle" size={20}  color="grey"/>} label="Review App" onPress={() => {}} />
        </View>
    </View>
);

const styles = StyleSheet.create({
  leftSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
});

export default ProfileBottomOptions;