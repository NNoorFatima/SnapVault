import React from 'react';
import { ScrollView, StyleSheet, I18nManager} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import BackgroundImage from '../../assets/UserProfileBackground';
const UserProfile = () => (

   <ScrollView
  style={styles.container}
  contentContainerStyle={styles.contentContainer}
>
      <BackgroundImage />
      <UserCard 
        name="Monkey D. Luffy"
        phone="123-456-7890" 
        email="luffy@strawhat.com" 
        // avatar="https://randomuser.me/api/portraits/men/1.jpg" 
        avatar={require('../../assets/temp-pfp.jpg')}
      />
    
      <ProfileBottomOptions />
    </ScrollView>
)


export default UserProfile; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 40,
  },

});