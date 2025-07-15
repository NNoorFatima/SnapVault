import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, ImageSourcePropType } from 'react-native';

interface GroupCardProps {
  groupId: number;
  groupName: string;
  groupDescription: string;
  groupCode: string;
  memberCount: number;
  groupImage: ImageSourcePropType;
  onPress: (groupData: {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
  }) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupId,
  groupName,
  groupDescription,
  groupCode,
  memberCount,
  groupImage,
  onPress,
}) => {
  const handlePress = () => {
    onPress({
      groupId,
      groupName,
      groupDescription,
      groupCode,
    });
  };

  return (
    <TouchableOpacity 
      style={styles.imageWrapper} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Image
        source={groupImage}
        style={styles.groupImage}
        onError={() => console.warn(`Failed to load group image for ${groupName}`)}
      />
      <View style={styles.imageOverlay}>
        <Text style={styles.groupName}>{groupName}</Text>
        <Text style={styles.memberCount}>{memberCount} members</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '48%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 0,
  },
  groupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    padding: 12,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberCount: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default GroupCard; 