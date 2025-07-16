import React, { useRef } from 'react';
import {View,Text,Dimensions,Animated,TouchableOpacity,} from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import ImageZoom from 'react-native-image-pan-zoom';
import { styles } from './ImageDetailScreen.styles';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
    return (
        <View style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.rectangle}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.pictures}>Pictures</Text>

                <View style={styles.flexRowDd}>
                    <View style={styles.group1}>
                        <Feather name="more-horizontal" size={28} color="white" />
                    </View>
                <View style={styles.regroup}>
                    <View style={styles.group1}>
                        <Feather name="download" size={28} color="white"  />
                    </View>
                    <View style={styles.group1}>
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
                <Feather name="minus-circle" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={zoomIn}>
                <Feather name="plus-circle" size={32} color="white" />
            </TouchableOpacity>
            </View>
        </View>
        );
    }
