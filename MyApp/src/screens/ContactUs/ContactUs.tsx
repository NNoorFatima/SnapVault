// screens/ContactUs/ContactUs.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactHeader from '../../components/ContactHeader';
import ContactCard from '../../components/ContactCard';
import SocialMediaCard from '../../components/SocialMediaCard';

const ContactUs: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {
    Alert.alert('Chat', 'Opening chat support...');
  };

  const handleCallPress = () => {
    Alert.alert('Call', 'Calling support team...');
  };

  const handleEmailPress = () => {
    Alert.alert('Email', 'Opening email client...');
  };

  const handleSocialPress = (platform: string) => {
    Alert.alert('Social Media', `Opening ${platform}...`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.phoneContainer}>
          <ContactHeader onBackPress={handleBackPress} />
          
          {/* Action Cards */}
          <View style={styles.actionCardsContainer}>
            <ContactCard
              title="Chat with Us"
              description="Need help with SnapVault? Contact our expert team for help"
              icon={<Text style={styles.cardIcon}>💬</Text>}
              backgroundColor="#950091"
              iconBackgroundColor="#b134a6"
              onPress={handleChatPress}
            />
            
            <ContactCard
              title="Call Us"
              description="Need help with SnapVault? Call our team for help and get your queries solved"
              icon={<Text style={styles.cardIcon}>📞</Text>}
              backgroundColor="#5000a9"
              iconBackgroundColor="#5000a9"
              onPress={handleCallPress}
            />
            
            <ContactCard
              title="Email Us"
              description="Email us and share your concerns"
              icon={<Text style={styles.cardIcon}>✉️</Text>}
              backgroundColor="#303f45"
              iconBackgroundColor="#303f45"
              onPress={handleEmailPress}
            />
          </View>

          {/* Social Media Section */}
          <View style={styles.socialMediaSection}>
            <Text style={styles.socialMediaTitle}>Our social media</Text>
            <View style={styles.socialMediaContainer}>
              <SocialMediaCard
                title="Twitter"
                icon={<Text style={styles.socialIcon}>🐦</Text>}
                onPress={() => handleSocialPress('Twitter')}
              />
              
              <SocialMediaCard
                title="Instagram"
                icon={<Text style={styles.socialIcon}>📷</Text>}
                onPress={() => handleSocialPress('Instagram')}
              />
              
              <SocialMediaCard
                title="Facebook"
                icon={<Text style={styles.socialIcon}>👥</Text>}
                onPress={() => handleSocialPress('Facebook')}
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
    paddingBottom: 55,
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