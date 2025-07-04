// screens/ContactUs/ContactUs.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactHeader from '../../components/ContactHeader';
import ContactCard from '../../components/ContactCard';
import SocialMediaCard from '../../components/SocialMediaCard';
//for localization
import { useTranslation } from 'react-i18next';

const ContactUs: React.FC = () => {
  //for localization
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {
    Alert.alert(t('ContactUs.chat'), t('ContactUs.chatMsg'));
  };

  const handleCallPress = () => {
    Alert.alert(t('ContactUs.call'), t('ContactUs.callMsg'));
  };

  const handleEmailPress = () => {
    Alert.alert(t('ContactUs.email'), t('ContactUs.emailMsg'));
  };

  const handleSocialPress = (platformKey: string) => {
  const platformName = t(`platforms.${platformKey}`);
  Alert.alert(
    t('ContactUs.social'),
    t('ContactUs.socialMsg', { platform: platformName })
  );
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.phoneContainer}>
          <ContactHeader onBackPress={handleBackPress} />
          
          {/* Action Cards */}
          <View style={styles.actionCardsContainer}>
            <ContactCard
              title={t('ContactUs.chat')}
              description={t('ContactUs.chatDes')}
              icon={<Text style={styles.cardIcon}>💬</Text>}
              backgroundColor="#950091"
              iconBackgroundColor="#b134a6"
              onPress={handleChatPress}
            />
            
            <ContactCard
              title={t('ContactUs.call')}
              description={t('ContactUs.callDes')}
              icon={<Text style={styles.cardIcon}>📞</Text>}
              backgroundColor="#5000a9"
              iconBackgroundColor="#5000a9"
              onPress={handleCallPress}
            />
            
            <ContactCard
              title={t('ContactUs.email')}
              description={t('ContactUs.emailDes')}
              icon={<Text style={styles.cardIcon}>✉️</Text>}
              backgroundColor="#303f45"
              iconBackgroundColor="#303f45"
              onPress={handleEmailPress}
            />
          </View>

          {/* Social Media Section */}
          <View style={styles.socialMediaSection}>
            <Text style={styles.socialMediaTitle}>{t('ContactUs.social')}</Text>
            <View style={styles.socialMediaContainer}>
              <SocialMediaCard
                title={t('platforms.twitter')}
                icon={<Text style={styles.socialIcon}>🐦</Text>}
                onPress={() => handleSocialPress('twitter')}
              />
              
              <SocialMediaCard
                title={t('platforms.instagram')}
                icon={<Text style={styles.socialIcon}>📷</Text>}
                onPress={() => handleSocialPress('instagram')}
              />
              
              <SocialMediaCard
                title={t('platforms.facebook')}
                icon={<Text style={styles.socialIcon}>👥</Text>}
                onPress={() => handleSocialPress('facebook')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  phoneContainer: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%', 
    borderRadius: 24,
    overflow: 'hidden',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionCardsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  socialMediaSection: {
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32, 
    padding: 16,
    paddingTop: 32,
  },
  socialMediaTitle: {
    color: '#18181b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  socialMediaContainer: {
    gap: 12,
  },
  cardIcon: {
    fontSize: 20,
    color: 'white',
  },
  socialIcon: {
    fontSize: 16,
  },
});

export default ContactUs;