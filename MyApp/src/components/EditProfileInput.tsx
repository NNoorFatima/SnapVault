import React from 'react';
import styles from './EditProfileInput.styles';
import { TextInputProps, Text,TextInput,View, StyleSheet } from 'react-native';   


interface EditProfileInputProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
}
const EditProfileInput: React.FC<EditProfileInputProps> = ({label, icon, ...props }) =>(

    <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
            {icon}
            <TextInput style={styles.input} {...props}/> 
        </View>
    </View>
);

export default EditProfileInput;
