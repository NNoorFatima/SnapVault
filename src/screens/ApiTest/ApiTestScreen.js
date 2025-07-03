/**
 * API Test Screen
 * Comprehensive testing interface for FastAPI backend operations
 * Tests only real backend endpoints (items and users)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { itemService, userService } from '../../services/index.js';

const ApiTestScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [itemId, setItemId] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample data for testing
  const sampleItem = {
    name: 'Test Item',
    description: 'A test item for API testing',
    price: 99.99,
    category: 'Electronics',
    stock: 50,
  };

  const sampleUser = {
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'password123',
  };

  /**
   * Generic API call handler with error handling
   */
  const handleApiCall = async (apiCall, operationName) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setResults(prev => ({
        ...prev,
        [operationName]: {
          success: true,
          data: response.data,
          message: response.message,
          timestamp: new Date().toISOString(),
        },
      }));
      Alert.alert('Success', `${operationName} completed successfully!`);
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorStatus = error?.statusCode || error?.response?.status || 'N/A';
      console.error(`${operationName} failed:`, error);
      setResults(prev => ({
        ...prev,
        [operationName]: {
          success: false,
          error: errorMessage,
          statusCode: errorStatus,
          timestamp: new Date().toISOString(),
        },
      }));
      Alert.alert('Error', `${operationName} failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // === ITEM API TESTS ===

  const testGetItems = () => {
    handleApiCall(
      () => itemService.getItems({ limit: 10 }),
      'Get Items'
    );
  };

  const testGetItemById = () => {
    if (!itemId.trim()) {
      Alert.alert('Error', 'Please enter an item ID');
      return;
    }
    handleApiCall(
      () => itemService.getItemById(itemId.trim()),
      'Get Item by ID'
    );
  };

  const testCreateItem = () => {
    handleApiCall(
      () => itemService.createItem(sampleItem),
      'Create Item'
    );
  };

  const testUpdateItem = () => {
    if (!itemId.trim()) {
      Alert.alert('Error', 'Please enter an item ID to update');
      return;
    }
    const updateData = {
      name: 'Updated Test Item',
      price: 149.99,
      stock: 75,
    };
    handleApiCall(
      () => itemService.updateItem(itemId.trim(), updateData),
      'Update Item'
    );
  };

  const testDeleteItem = () => {
    if (!itemId.trim()) {
      Alert.alert('Error', 'Please enter an item ID to delete');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete item ${itemId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            handleApiCall(
              () => itemService.deleteItem(itemId.trim()),
              'Delete Item'
            );
          },
        },
      ]
    );
  };

  const testGetCategories = () => {
    handleApiCall(
      () => itemService.getCategories(),
      'Get Categories'
    );
  };

  const testSearchItems = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }
    handleApiCall(
      () => itemService.searchItems(searchQuery.trim()),
      'Search Items'
    );
  };

  const testGetItemsByCategory = () => {
    if (!selectedCategory.trim()) {
      Alert.alert('Error', 'Please enter a category');
      return;
    }
    handleApiCall(
      () => itemService.getItemsByCategory(selectedCategory.trim()),
      'Get Items by Category'
    );
  };

  // === USER API TESTS ===

  const testGetUsers = () => {
    handleApiCall(
      () => userService.getUsers({ limit: 10 }),
      'Get Users'
    );
  };

  const testGetUserById = () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }
    handleApiCall(
      () => userService.getUserById(userId.trim()),
      'Get User by ID'
    );
  };

  const testCreateUser = () => {
    handleApiCall(
      () => userService.createUser(sampleUser),
      'Create User'
    );
  };

  const testUpdateUser = () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a user ID to update');
      return;
    }
    const updateData = {
      first_name: 'Updated',
      last_name: 'User',
    };
    handleApiCall(
      () => userService.updateUser(userId.trim(), updateData),
      'Update User'
    );
  };

  const testDeleteUser = () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a user ID to delete');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete user ${userId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            handleApiCall(
              () => userService.deleteUser(userId.trim()),
              'Delete User'
            );
          },
        },
      ]
    );
  };

  const testSearchUsers = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }
    handleApiCall(
      () => userService.searchUsers(searchQuery.trim()),
      'Search Users'
    );
  };

  // === UTILITY FUNCTIONS ===

  const clearResults = () => {
    setResults({});
  };

  const renderTestButton = (title, onPress, color = '#007AFF') => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderResult = (operation, result) => {
    if (!result) return null;

    const { success, data, error, message, timestamp } = result;
    const backgroundColor = success ? '#E8F5E8' : '#FFEBEE';
    const borderColor = success ? '#4CAF50' : '#F44336';

    return (
      <View key={operation} style={[styles.resultCard, { backgroundColor, borderColor }]}>
        <Text style={styles.resultTitle}>{operation}</Text>
        <Text style={styles.resultStatus}>
          Status: {success ? 'Success' : 'Error'}
        </Text>
        <Text style={styles.resultMessage}>
          {success ? message : error}
        </Text>
        {data && (
          <Text style={styles.resultData}>
            Data: {JSON.stringify(data, null, 2)}
          </Text>
        )}
        <Text style={styles.resultTimestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>FastAPI Backend Testing</Text>
        
        {/* Input Fields */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Input Parameters</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Item ID"
            value={itemId}
            onChangeText={setItemId}
          />
          
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={userId}
            onChangeText={setUserId}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Search Query"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={selectedCategory}
            onChangeText={setSelectedCategory}
          />
        </View>

        {/* Item API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item API Tests</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Get All Items', testGetItems, '#4CAF50')}
            {renderTestButton('Get Item by ID', testGetItemById, '#2196F3')}
            {renderTestButton('Create Item', testCreateItem, '#FF9800')}
            {renderTestButton('Update Item', testUpdateItem, '#9C27B0')}
            {renderTestButton('Delete Item', testDeleteItem, '#F44336')}
            {renderTestButton('Get Categories', testGetCategories, '#607D8B')}
            {renderTestButton('Search Items', testSearchItems, '#795548')}
            {renderTestButton('Get Items by Category', testGetItemsByCategory, '#009688')}
          </View>
        </View>

        {/* User API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User API Tests</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Get All Users', testGetUsers, '#4CAF50')}
            {renderTestButton('Get User by ID', testGetUserById, '#2196F3')}
            {renderTestButton('Create User', testCreateUser, '#FF9800')}
            {renderTestButton('Update User', testUpdateUser, '#9C27B0')}
            {renderTestButton('Delete User', testDeleteUser, '#F44336')}
            {renderTestButton('Search Users', testSearchUsers, '#795548')}
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>API Results</Text>
            <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          {Object.keys(results).length === 0 ? (
            <Text style={styles.noResults}>No API calls made yet</Text>
          ) : (
            Object.entries(results).map(([operation, result]) =>
              renderResult(operation, result)
            )
          )}
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing API call...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  resultCard: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultData: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 16,
  },
});

export default ApiTestScreen; 