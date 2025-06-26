import React from 'react';
import { ScrollView, View } from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
import LinearGradient from 'react-native-linear-gradient';

const UserProfile = () => (

  <LinearGradient
      colors={['#0F0C29', '#302B63', '#24243e']} // replace with your desired colors
      style={{ flex: 1 }}
  >
    <ScrollView style={{flex:1, backgroundColor:'#f2f2f2' }}>
      <UserCard 
      name="John Doe"
      phone="123-456-7890" 
      email="vD2Ej@example.com" 
      avatar="https://randomuser.me/api/portraits/men/1.jpg" 
      />
    
      <ProfileBottomOptions />
    {/* Add <BottomActions /> and modal later */}
    </ScrollView>
  </LinearGradient>
)


export default UserProfile; 
