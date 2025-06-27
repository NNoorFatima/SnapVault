import React from 'react';
import ConfirmationPopUp from '../../components/ConfirmationPopUp';
import { View } from 'react-native';

const Logout = () => {
    return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ConfirmationPopUp
            message="Are you sure you want to logout?"
            onConfirm={() => {}}
            onCancel={() => {}}
            />
        </View>
  );
};

export default Logout;