import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, ImageSourcePropType } from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

interface GroupListItemProps {
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

const GroupListItem: React.FC<GroupListItemProps> = ({
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
      style={styles.container} 
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Group Image */}
      <View style={styles.imageContainer}>
        <Image
          source={groupImage}
          style={styles.groupImage}
          onError={() => console.warn(`Failed to load group image for ${groupName}`)}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.overlayCode}>{groupCode}</Text>
        </View>
      </View>
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.groupName} numberOfLines={1}>{groupName}</Text>
          <Feather name="chevron-right" size={20} color="#6366F1" />
        </View>
        
        <Text style={styles.groupDescription} numberOfLines={2}>
          {groupDescription}
        </Text>
        
        <View style={styles.footerSection}>
          <View style={styles.memberInfo}>
            <View style={styles.memberIconContainer}>
              <Feather name="users" size={14} color="#6366F1" />
            </View>
            <Text style={styles.memberText}>{memberCount} members</Text>
          </View>
          <View style={styles.statusIndicator} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1c1c42',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
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
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  overlayCode: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.3,
  },
  groupDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: '400',
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  memberText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
});

export default GroupListItem; 