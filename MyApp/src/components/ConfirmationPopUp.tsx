import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import styles from './ConfirmationPopup.styles';
import { useNavigation } from '@react-navigation/native'; //used for navigation among pages 
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}


const ConfirmationPopUp: React.FC<Props> = ({  message, onCancel, onConfirm}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    return (
        
        <View style={styles.backdrop}>
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonRow}>
            <Button
                title="Cancel"
                onPress={onCancel} //should go back to the current screen 
                backgroundColor="#D7EDEF"
                textColor="black"
                style={{ width: '50%' }}

            />
            <Button
                title="Confirm"
                onPress={() => console.log('Button Pressed')} //should go to splash screen 
                backgroundColor="#73DBE5"
                textColor="black"
                style={{ width: '50%' }}
            />
            </View>
        </View>
        </View>
    );
};

export default ConfirmationPopUp;