import React from 'react';
import ConfirmationPopUp from '../components/ConfirmationPopUp';
import { View } from 'react-native';

const DeleteAcct = () => {
    return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ConfirmationPopUp
            message="Are you sure you want to delete account?"
            onConfirm={() => {}}
            onCancel={() => {}}
            />
        </View>
  );
};

export default DeleteAcct;