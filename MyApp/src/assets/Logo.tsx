import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {LogoutImageProps} from './Logo.types';
import {styles} from './Logo.styles';

const Logo: React.FC<LogoutImageProps> = ({
    source,
    style,
    testID = 'logout-image',
}) => {
    return (
        <View style={[styles.imageContainer, style]} testID={`${testID}-container`}>
        <Image
            source={source}
            style={styles.image}
            resizeMode="cover"
            testID={testID}
            accessible={true}
            accessibilityLabel="Logout confirmation icon"
            accessibilityRole="image"
        />
        </View>
    );
};

export default Logo;
