import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileOption from './ProfileOption';
// import styles from './UserCard.styles';
//for localization
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';  

// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
const ProfileBottomOptions = () => { 
  //for localization 
  const { t } = useTranslation();
  return(
  
      <View style={styles.card}>
          <View style={styles.leftSection}>
              <ProfileOption icon={<Feather name="phone-call" size={20} color="grey" />} label={t('profile.contactUs')} onPress={() => {}} />
              <ProfileOption icon={<Feather name="alert-circle" size={20}  color="grey"/>} label={t('profile.reviewApp')} onPress={() => {}} />
          </View>
      </View>
  );
};
const styles = StyleSheet.create({
  leftSection: {
    // flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    // width: '100%',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    marginStart:12,
    marginEnd:12,
  },
});

export default ProfileBottomOptions;