import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileOption from './ProfileOption';
// import styles from './UserCard.styles';

// import { I18nManager } from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/AppNavigator';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';
// import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
// import { TabParamList } from '../navigation/AppNavigator';
//for localization
import { useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';
import { changeAppLanguage } from '../localization/i18n';

const ProfileBottomOptions = () => { 
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  //for localization 
  const { t } = useTranslation();
  // const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  return(
  
      <View style={styles.card}>
          <View style={styles.leftSection}>
              <ProfileOption icon={<Feather name="phone-call" size={20} color='#222831' />} label={t('profile.contactUs')} onPress={() => navigation.navigate('Contact Us')} />
              {/* <ProfileOption icon={<Feather name="alert-circle" size={20}  color="grey"/>} label={t('profile.reviewApp')} onPress={() => {}} /> */}
              {/*change language  */}
                              <ProfileOption icon={<Feather name="globe" size={20} color='#222831' />} label= {t('profile.changeLanguage')}
                                  onPress={() => {
                                  const newLang = i18n.language === 'en' ? 'ur' : 'en';
                                  changeAppLanguage(newLang); //  calls RTL logic and restarts
                              }}/>
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
    backgroundColor: 'rgba(141, 184, 188, 0.9)', // match UserCard color and opacity
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    marginStart:20,
    marginEnd:20,
    width: '90%',
  },
});

export default ProfileBottomOptions;