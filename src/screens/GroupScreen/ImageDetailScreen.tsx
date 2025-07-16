import React, { useRef } from 'react';
import {View,Text,Dimensions,Animated,TouchableOpacity,} from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import ImageZoom from 'react-native-image-pan-zoom';
import { styles } from './ImageDetailScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isRTL = I18nManager.isRTL;
export default function ImageDetailScreen() {
const scale = useRef(new Animated.Value(1)).current;

const zoomIn = () => {
Animated.timing(scale, {
    toValue: Math.min(scale.__getValue() + 0.2, 3),
    duration: 200,
    useNativeDriver: true,
}).start();
};

const zoomOut = () => {
Animated.timing(scale, {
    toValue: Math.max(scale.__getValue() - 0.2, 1),
    duration: 200,
    useNativeDriver: true,
}).start();
};
    const navigation = useNavigation();
    const { t } = useTranslation();
    

    return (
        <View style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.rectangle}>

                <View style={ styles.tabBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.pictures}>{t('ImageDetailScreen.title')}</Text>
                </View>

                <View style={styles.flexRowDd}>
                    <View style={styles.iconBackground}>
                        <Feather name="more-horizontal" size={28} color="white" />
                    </View>
                <View style={styles.regroup}>
                    <View style={styles.iconBackground}>
                        <Feather name="download" size={28} color="white"  />
                    </View>
                    <View style={styles.iconBackground}>
                        <Feather name="share" size={28} color="white" />
                    </View>
                </View>
                </View>
                
            </View>

            {/* Zoomable Image */}
            <ImageZoom
                cropWidth={screenWidth}
                cropHeight={screenHeight * 0.5}
                imageWidth={screenWidth}
                imageHeight={screenHeight * 0.5}
            >
            <Animated.Image
                source={{
                uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-15/SF3SavAtaa.png',
                }}
                resizeMode="cover" // fill horizontal width, even if some height is cropped
                style={{
                width: screenWidth,        // force full width
                height: screenHeight * 0.5, // set fixed height
                transform: [{ scale }],
                backgroundColor: '#000',
                }}
            />
            </ImageZoom>


            {/* Zoom Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={zoomOut}>
                    <Feather name="minus" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomIn}>
                    <Feather name="plus" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
        );
    }
