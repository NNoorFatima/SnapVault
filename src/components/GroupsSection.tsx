import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ImageSourcePropType } from 'react-native';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import GroupCard from './GroupCard';

interface GroupData {
  id: number;
  name: string;
  description: string;
  code: string;
  memberCount: number;
  image: ImageSourcePropType;
}

interface GroupsSectionProps {
  title: string;
  viewAllText: string;
  groups: GroupData[];
  backgroundImage: ImageSourcePropType;
  onViewAll: () => void;
  onGroupPress: (groupData: {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
  }) => void;
}

const GroupsSection: React.FC<GroupsSectionProps> = ({
  title,
  viewAllText,
  groups,
  backgroundImage,
  onViewAll,
  onGroupPress,
}) => {
  return (
    <>
      <View style={styles.myGroupsHeader}>
        <Text style={styles.myGroupsTitle}>{title}</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>{viewAllText}</Text>
          <Feather name="arrow-right" size={23} color="white" />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.groupsSectionBackground}
        imageStyle={styles.groupsSectionImageStyle}
      >
        <View style={styles.imageGrid}>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              groupId={group.id}
              groupName={group.name}
              groupDescription={group.description}
              groupCode={group.code}
              memberCount={group.memberCount}
              groupImage={group.image}
              onPress={onGroupPress}
            />
          ))}
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  myGroupsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  myGroupsTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1c1c42',
    borderRadius: 12,
  },
  viewAllText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  groupsSectionBackground: {
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
  groupsSectionImageStyle: {
    borderRadius: 24,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    minHeight: 150, // Ensure minimum height for better FlatList performance
  },
});

export default GroupsSection; 