import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';

const DashboardScreen = () => {
  // Enhanced colorful group images with better color palette
  const groupImageUrls = [
    'https://placehold.co/200x200/6366F1/FFFFFF?text=Group+1', // Indigo
    'https://placehold.co/200x200/10B981/FFFFFF?text=Group+2', // Emerald
    'https://placehold.co/200x200/F59E0B/FFFFFF?text=Group+3', // Amber
    'https://placehold.co/200x200/EF4444/FFFFFF?text=Group+4', // Red
    'https://placehold.co/200x200/8B5CF6/FFFFFF?text=Group+5', // Violet
    'https://placehold.co/200x200/06B6D4/FFFFFF?text=Group+6', // Cyan
    'https://placehold.co/200x200/84CC16/FFFFFF?text=Group+7', // Lime
    'https://placehold.co/200x200/EC4899/FFFFFF?text=Group+8', // Pink
  ];

  const screenWidth = Dimensions.get('window').width;
  const contentWrapperWidth = Math.min(screenWidth - 32, 420);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, { width: contentWrapperWidth }]}>

          {/* Status Bar Spacer */}
          <View style={styles.statusBarSpacer} />

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.profilePicContainer}>
                <Image
                  source={{ uri: 'https://placehold.co/56x56/6366F1/ffffff?text=MW' }}
                  style={styles.profilePic}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingSubtext}>Welcome back</Text>
                <Text style={styles.greetingText}>Muhammad Waleed</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* SnapVault Introduction Card */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Text style={styles.appTitle}>SnapVault</Text>
              <Text style={styles.versionTag}>v2.1</Text>
            </View>
            <Text style={styles.introText}>
              Simplify sharing, protect privacy, and ensure no memory gets lost. 
              Join groups and get your pictures filtered out automatically!
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.joinButton]}>
                <View style={styles.buttonIconContainer}>
                  <Text style={styles.buttonIcon}>👥</Text>
                </View>
                <Text style={styles.buttonText}>Join Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.createButton]}>
                <View style={styles.buttonIconContainer}>
                  <Text style={styles.buttonIcon}>➕</Text>
                </View>
                <Text style={styles.buttonText}>Create Groups</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Groups</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.3GB</Text>
              <Text style={styles.statLabel}>Storage</Text>
            </View>
          </View>

          {/* My Groups Section */}
          <View style={styles.myGroupsHeader}>
            <Text style={styles.myGroupsTitle}>My Groups</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Image Grid */}
          <View style={styles.imageGrid}>
            {groupImageUrls.map((src, index) => (
              <TouchableOpacity key={index} style={styles.imageWrapper} activeOpacity={0.8}>
                <Image
                  source={{ uri: src }}
                  style={styles.groupImage}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.groupName}>Group {index + 1}</Text>
                  <Text style={styles.memberCount}>{Math.floor(Math.random() * 20) + 3} members</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep dark blue
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 50,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0F0F23',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0F0F23',
  },

  // Intro Card Styles
  introCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#312E81',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  introText: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButton: {
    backgroundColor: '#10B981',
  },
  createButton: {
    backgroundColor: '#6366F1',
  },
  buttonIconContainer: {
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },

  // Groups Header Styles
  myGroupsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  viewAllText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  viewAllArrow: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },

  // Image Grid Styles
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  imageWrapper: {
    width: '48%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
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
    backgroundColor: '#1f2937',
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
  
  bottomSpacer: {
    height: 40,
  },
});

export default DashboardScreen;