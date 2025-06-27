import React from 'react';
import { ScrollView, View, Image} from 'react-native';
import UserCard from '../../components/UserCard';
import ProfileBottomOptions from '../../components/ProfileBottomOptions';
// import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from '../../assets/UserProfileBackground';
const UserProfile = () => (

//   <LinearGradient
//   colors={['#000000', '#3b0049', '#8e007c', '#a0008d', '#00a5b5']}
//   locations={[0, 0.3, 0.5, 0.7, 1]}
//   start={{ x: 0.1, y: 0 }}
//   end={{ x: 1, y: 1 }}
//   style={{ flex: 1 }}
// >
    <ScrollView style={{flex: 1, backgroundColor: 'transparent',}}>
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
