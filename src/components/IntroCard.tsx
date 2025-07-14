import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ImageSourcePropType } from 'react-native';
import ActionButton from './ActionButton';

interface IntroCardProps {
  appTitle: string;
  version: string;
  description: string;
  backgroundImage: ImageSourcePropType;
  onJoinGroup: () => void;
  onCreateGroup: () => void;
  joinButtonText: string;
  createButtonText: string;
}

const IntroCard: React.FC<IntroCardProps> = ({
  appTitle,
  version,
  description,
  backgroundImage,
  onJoinGroup,
  onCreateGroup,
  joinButtonText,
  createButtonText,
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.introCardImageBackground}
      imageStyle={styles.introCardImageStyle}
    >
      <View style={styles.introContentWrapper}>
        <View style={styles.introHeader}>
          <Text style={styles.appTitle}>{appTitle}</Text>
          <Text style={styles.versionTag}>{version}</Text>
        </View>
        <Text style={styles.introText}>{description}</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            title={joinButtonText}
            onPress={onJoinGroup}
            backgroundColor="#DE6CED"
            iconName="users"
          />
          <ActionButton
            title={createButtonText}
            onPress={onCreateGroup}
            backgroundColor="#6366F1"
            iconName="plus-circle"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  introCardImageBackground: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9573e5',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  introCardImageStyle: {
    borderRadius: 24,
  },
  introContentWrapper: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  versionTag: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#1c1c42',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  introText: {
    color: '#F1F5F9',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default IntroCard; 