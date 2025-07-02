/**
 * API Test Screen
 * Comprehensive testing interface for all API operations
 * Demonstrates the new API architecture and SOLID principles
 */

import React, { useState, useEffect } from 'react';
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
import { userService, productService, authService, itemService } from '../../services/index.js';

const ApiTestScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState('1');
  const [productId, setProductId] = useState('1');

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
      // Defensive: fallback to string if error.message is not available
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

  /**
   * User API Tests
   */
  const testGetUsers = () => {
    handleApiCall(
      () => userService.getUsers({ limit: 5 }),
      'Get Users'
    );
  };

  const testGetUserById = () => {
    handleApiCall(
      () => userService.getUserById(parseInt(userId)),
      'Get User by ID'
    );
  };

  const testSearchUsers = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }
    handleApiCall(
      () => userService.searchUsers(searchQuery),
      'Search Users'
    );
  };

  const testCreateUser = () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'password123',
    };
    handleApiCall(
      () => userService.createUser(newUser),
      'Create User'
    );
  };

  /**
   * Product API Tests
   */
  const testGetProducts = () => {
    handleApiCall(
      () => productService.getProducts({ limit: 5 }),
      'Get Products'
    );
  };

  const testGetProductById = () => {
    handleApiCall(
      () => productService.getProductById(parseInt(productId)),
      'Get Product by ID'
    );
  };

  const testGetCategories = () => {
    handleApiCall(
      () => productService.getCategories(),
      'Get Categories'
    );
  };

  const testSearchProducts = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }
    handleApiCall(
      () => productService.searchProducts(searchQuery),
      'Search Products'
    );
  };

  const testGetProductsByCategory = () => {
    handleApiCall(
      () => productService.getProductsByCategory('smartphones'),
      'Get Products by Category'
    );
  };

  const testCreateProduct = () => {
    const newProduct = {
      title: 'Test Product',
      description: 'A test product for API testing',
      price: 99.99,
      category: 'electronics',
      brand: 'TestBrand',
      stock: 100,
    };
    handleApiCall(
      () => productService.createProduct(newProduct),
      'Create Product'
    );
  };

  /**
   * Auth API Tests (Mock - since DummyJSON doesn't have auth endpoints)
   */
  const testAuthLogin = () => {
    Alert.alert('Info', 'Auth endpoints are not available in DummyJSON. This would test login functionality.');
  };

  const testAuthRegister = () => {
    Alert.alert('Info', 'Auth endpoints are not available in DummyJSON. This would test registration functionality.');
  };

  /**
   * Item API Tests (Mock - since DummyJSON doesn't have items endpoints)
   */
  const testGetItems = () => {
    Alert.alert('Info', 'Items endpoints are not available in DummyJSON. This would test getting items.');
  };

  const testCreateItem = () => {
    Alert.alert('Info', 'Items endpoints are not available in DummyJSON. This would test creating items.');
  };

  /**
   * Clear results
   */
  const clearResults = () => {
    setResults({});
  };

  /**
   * Render API test button
   */
  const renderTestButton = (title, onPress, color = '#007AFF') => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  /**
   * Render result item
   */
  const renderResult = (operation, result) => {
    // Try to display a list of user names if the result is a user list
    let userList = null;
    if (Array.isArray(result?.data?.data) && result?.data?.data[0]?.firstName) {
      userList = (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: 'bold', color: '#6366F1' }}>Users:</Text>
          {result.data.data.map((user, idx) => (
            <Text key={user.id || idx} style={{ fontSize: 12, color: '#222' }}>
              {user.firstName} {user.lastName} (ID: {user.id})
            </Text>
          ))}
        </View>
      );
    }
    return (
      <View key={operation} style={styles.resultContainer}>
        <Text style={styles.resultTitle}>{operation}</Text>
        <Text style={[
          styles.resultStatus,
          { color: result.success ? '#34C759' : '#FF3B30' }
        ]}>
          {result.success ? '✅ Success' : '❌ Failed'}
        </Text>
        <Text style={styles.resultTimestamp}>
          {new Date(result.timestamp).toLocaleTimeString()}
        </Text>
        {result.success ? (
          <>
            <Text style={styles.resultData}>
              {JSON.stringify(result.data, null, 2).substring(0, 200)}...
            </Text>
            {userList}
          </>
        ) : (
          <Text style={styles.resultError}>
            Error: {result.error || 'Unknown error'}
            {result.statusCode ? ` (${result.statusCode})` : ''}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>API Testing Interface</Text>
        <Text style={styles.subtitle}>
          Test the new API architecture with DummyJSON endpoints
        </Text>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Input Parameters</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Search Query:</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Enter search term..."
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>User ID:</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter user ID..."
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Product ID:</Text>
            <TextInput
              style={styles.input}
              value={productId}
              onChangeText={setProductId}
              placeholder="Enter product ID..."
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* User API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User API Tests</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Get Users', testGetUsers, '#007AFF')}
            {renderTestButton('Get User by ID', testGetUserById, '#007AFF')}
            {renderTestButton('Search Users', testSearchUsers, '#007AFF')}
            {renderTestButton('Create User', testCreateUser, '#007AFF')}
          </View>
        </View>

        {/* Product API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product API Tests</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Get Products', testGetProducts, '#34C759')}
            {renderTestButton('Get Product by ID', testGetProductById, '#34C759')}
            {renderTestButton('Get Categories', testGetCategories, '#34C759')}
            {renderTestButton('Search Products', testSearchProducts, '#34C759')}
            {renderTestButton('Get by Category', testGetProductsByCategory, '#34C759')}
            {renderTestButton('Create Product', testCreateProduct, '#34C759')}
          </View>
        </View>

        {/* Auth API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auth API Tests (Mock)</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Login', testAuthLogin, '#FF9500')}
            {renderTestButton('Register', testAuthRegister, '#FF9500')}
          </View>
        </View>

        {/* Item API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item API Tests (Mock)</Text>
          <View style={styles.buttonGrid}>
            {renderTestButton('Get Items', testGetItems, '#AF52DE')}
            {renderTestButton('Create Item', testCreateItem, '#AF52DE')}
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          {Object.keys(results).length === 0 ? (
            <Text style={styles.noResults}>No test results yet. Run some tests above!</Text>
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
            <Text style={styles.loadingText}>Processing API request...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    width: 100,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    fontStyle: 'italic',
    padding: 20,
  },
  resultContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 12,
    color: '#1C1C1E',
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
  },
  resultError: {
    fontSize: 12,
    color: '#FF3B30',
    fontFamily: 'monospace',
    backgroundColor: '#FFE5E5',
    padding: 8,
    borderRadius: 4,
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
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
});

export default ApiTestScreen; 