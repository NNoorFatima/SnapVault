import React from 'react';
import { ScrollView, StyleSheet} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import BackgroundImage from '../../assets/UserProfileBackground';
const UserProfile = () => (

    <ScrollView style={styles.container}>
      <BackgroundImage />
      <UserCard 
      name="John Doe"
      phone="123-456-7890" 
      email="vD2Ej@example.com" 
      avatar="https://randomuser.me/api/portraits/men/1.jpg" 
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
    backgroundColor: 'transparent'
  }

});