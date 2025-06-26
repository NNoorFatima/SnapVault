import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';   

const ProfileOption = ({ icon, label, onPress }:any) => (

        <TouchableOpacity onPress={onPress} style={styles.option}>
            {/* <View style={styles.icon}>{icon}</View> */}
            {icon}
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,   
    justifyContent: 'flex-start',
    backgroundColor: 'white',    
  },
  label: {
    marginLeft: 20,
    fontSize: 16,
    color: 'grey',
  },
});

export default ProfileOption;