import React from 'react';
import { ScrollView, StyleSheet, I18nManager} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import BackgroundImage from '../../assets/UserProfileBackground';
const UserProfile = () => (

    <ScrollView style={styles.container}>
      <BackgroundImage />
      <UserCard 
        name="Muhammad Waleed"
        phone="123-456-7890" 
        email="waleed@example.com" 
        // avatar="https://randomuser.me/api/portraits/men/1.jpg" 
        avatar={require('./img/person-icon.png')}
      />
    
      <ProfileBottomOptions />
    {/* Add <BottomActions /> and modal later */}
    </ScrollView>
  // </LinearGradient>
)


export default UserProfile; 

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    backgroundColor: 'transparent',
  }

});