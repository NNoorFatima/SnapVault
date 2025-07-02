import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'; 
import { I18nManager } from 'react-native';  

const ProfileOption = ({ icon, label, onPress, shouldFlip = true  }:any) => {
  const isRTL = I18nManager.isRTL;  
  //change placement of icon label if RTL 
  // for rtl it is {label icon} otherwise {icon label}
  const iconComponent = React.cloneElement(icon, {
    style: [
      icon.props.style,
      shouldFlip && isRTL && { transform: [{ scaleX: -1 }] }, // mirror if needed
    ],
  });
  // Pick style variant
  const optionStyle = isRTL ? styles.optionRTL : styles.optionLTR;
  const layout = isRTL ? 
            (
                <>
                <Text style={styles.label}>{label}</Text>
                {iconComponent}
                </>
              ) : (
                <>
                {iconComponent}
                <Text style={styles.label}>{label}</Text>
                </>
            );
  return(
        <TouchableOpacity onPress={onPress} style={optionStyle}>
          {layout}
        </TouchableOpacity>
    );
  };
    
// Optional helper to decide which icons should flip in RTL
const iconShouldFlip = (iconName: string) => {
  const directionalIcons = ['arrow-left', 'chevron-left', 'arrow-forward', 'arrow-back', 'angle-left'];
  return directionalIcons.includes(iconName);
};
const styles = StyleSheet.create({
  optionLTR: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  optionRTL: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  label: {
    marginStart: 20,
    fontSize: 16,
    color: 'grey',
    // textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

export default ProfileOption;