import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import BackgroundImage from '../../assets/UserProfileBackground'; // Assuming this is a valid component or image asset
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';

const { width, height } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;

const HighlightsScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* BackgroundImage should cover the entire screen */}
            <BackgroundImage style={styles.backgroundImage} />
            
            {/* Content Section */}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* Header */}
                <View style={styles.tabBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Highlights</Text>
                </View>

                {/* Content */}
                <View style={styles.rectangle}>
                    <Text style={styles.text}>Hello</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent', // Ensure the background is transparent
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingLeft: 15,
        zIndex: 1, // Ensure header is above the background image
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        marginStart: '25%',
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent', // Transparent so the background image remains visible
    },
    rectangle: {
        width: width * 0.88,   // 10% of screen width
        height: height * 0.63, // 10% of screen height
        backgroundColor: 'rgba(183, 226, 255, 0.3)', // Translucent blue
        justifyContent: 'center',//for vertical alignment
        alignItems: 'center', //for horizontal allignment
        borderRadius: 20,
        borderColor: '#73DBE5',
        borderWidth: 2,
        marginTop: height * 0.09,
        alignSelf: 'center',
    },
    text: {
        color: 'white', // Text color
    }
});

export default HighlightsScreen;
