import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import GroupListItem from '../../components/GroupListItem';

interface GroupData {
  id: number;
  name: string;
  description: string;
  code: string;
  memberCount: number;
  image: any;
}

type AllGroupsScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'AllGroups'>;
type AllGroupsScreenRouteProp = RouteProp<MainTabParamList, 'AllGroups'>;

interface AllGroupsScreenProps {
  navigation: AllGroupsScreenNavigationProp;
  route: AllGroupsScreenRouteProp;
}

const AllGroupsScreen: React.FC<AllGroupsScreenProps> = ({ navigation, route }) => {
  // Fallback to mock data if no params provided
  const groups = route.params?.groups ?? [
    {
      id: 1,
      name: 'Group 1',
      description: 'This is the description for Group 1. A wonderful group for sharing memories and photos.',
      code: 'GRP001',
      memberCount: 5,
      image: require('../DashBoard/img/group1.png'),
    },
    {
      id: 2,
      name: 'Group 2',
      description: 'This is the description for Group 2. A wonderful group for sharing memories and photos.',
      code: 'GRP002',
      memberCount: 8,
      image: require('../DashBoard/img/group1.png'),
    },
    // ...add more mock groups as needed
  ];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groups;
    }
    return groups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  const handleGroupPress = (groupData: {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupCode: string;
  }) => {
    navigation.navigate('GroupScreen', groupData);
  };

  const screenWidth = Dimensions.get('window').width;
  const contentWrapperWidth = Math.min(screenWidth - 1, 420);

  const renderGroupItem = ({ item }: { item: GroupData }) => (
    <GroupListItem
      groupId={item.id}
      groupName={item.name}
      groupDescription={item.description}
      groupCode={item.code}
      memberCount={item.memberCount}
      groupImage={item.image}
      onPress={handleGroupPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <ImageBackground
        source={require('../DashBoard/img/background2.png')}
        resizeMode="cover"
        style={styles.emptyStateBackground}
        imageStyle={styles.emptyStateImageStyle}
      >
        <View style={styles.emptyStateContent}>
          <Feather name="search" size={64} color="rgba(255, 255, 255, 0.7)" />
          <Text style={styles.emptyStateTitle}>No Groups Found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery.trim() 
              ? `No groups match "${searchQuery}". Try a different search term.`
              : "You haven't joined any groups yet. Create or join a group to get started!"
            }
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Groups</Text>
      <View style={styles.headerSpacer} />
    </View>

      {/* Search Card */}
      <ImageBackground
        source={require('../DashBoard/img/background2.png')}
        resizeMode="cover"
        style={styles.searchCardBackground}
        imageStyle={styles.searchCardImageStyle}
      >
        <View style={styles.searchContentWrapper}>
          <View style={styles.searchHeader}>
            <Feather name="search" size={24} color="#FFFFFF" />
            <Text style={styles.searchTitle}>Find Your Groups</Text>
          </View>
          <Text style={styles.searchSubtitle}>
            Search through your joined groups by name
          </Text>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search groups by name..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Feather name="x" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>

      {/* Results Header */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery.trim() ? 'Search Results' : 'My Groups'}
          </Text>
          <View style={styles.resultsStats}>
            <Text style={styles.resultsText}>
              {searchQuery.trim() 
                ? `${filteredGroups.length} of ${groups.length} groups`
                : `${groups.length} group${groups.length !== 1 ? 's' : ''}`
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.contentWrapper, { width: contentWrapperWidth }]}>
        <FlatList
          data={filteredGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 16,
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 44,
  },

  // Search Card Styles
  searchCardBackground: {
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
  searchCardImageStyle: {
    borderRadius: 24,
  },
  searchContentWrapper: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  searchSubtitle: {
    color: '#F1F5F9',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '400',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 14,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },

  // Results Section Styles
  resultsContainer: {
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  resultsStats: {
    backgroundColor: '#1c1c42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultsText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },

  // Empty State Styles
  emptyStateContainer: {
    marginTop: 40,
  },
  emptyStateBackground: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9573e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  emptyStateImageStyle: {
    borderRadius: 24,
  },
  emptyStateContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    minHeight: 200,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyStateText: {
    color: '#F1F5F9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
});

export default AllGroupsScreen; 