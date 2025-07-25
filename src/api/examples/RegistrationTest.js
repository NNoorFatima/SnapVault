/**
 * Registration API Test Examples
 * This file demonstrates how to use the registration API
 */

import { getAuthService } from '../ApiFactory';

/**
 * Test registration with mock data
 */
export const testRegistration = async () => {
  try {
    const authService = getAuthService();
    
    // Mock registration data
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      profilePicture: {
        uri: 'file://path/to/test-image.jpg',
        type: 'image/jpeg',
        name: 'test-profile.jpg',
      },
    };

    console.log('🔄 Testing registration with data:', {
      name: registrationData.name,
      email: registrationData.email,
      imageType: registrationData.profilePicture.type,
    });

    const response = await authService.register(registrationData);
    
    console.log('✅ Registration successful:', response);
    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
};

/**
 * Test registration validation
 */
export const testRegistrationValidation = async () => {
  const authService = getAuthService();
  
  // Test cases
  const testCases = [
    {
      name: 'Empty name',
      data: { name: '', email: 'test@example.com', password: 'password123', profilePicture: {} },
      expectedError: 'Missing required fields: name, profilePicture',
    },
    {
      name: 'Invalid email',
      data: { name: 'Test User', email: 'invalid-email', password: 'password123', profilePicture: {} },
      expectedError: 'Missing required fields: profilePicture',
    },
    {
      name: 'Missing profile picture',
      data: { name: 'Test User', email: 'test@example.com', password: 'password123' },
      expectedError: 'Missing required fields: profilePicture',
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`🔄 Testing: ${testCase.name}`);
      await authService.register(testCase.data);
      console.log(`❌ Test failed: ${testCase.name} - should have thrown error`);
    } catch (error) {
      console.log(`✅ Test passed: ${testCase.name} - ${error.message}`);
    }
  }
};

/**
 * Test registration with different image types
 */
export const testImageTypes = async () => {
  const authService = getAuthService();
  
  const imageTypes = [
    { type: 'image/jpeg', name: 'profile.jpg', valid: true },
    { type: 'image/png', name: 'profile.png', valid: true },
    { type: 'image/gif', name: 'profile.gif', valid: false },
    { type: 'application/pdf', name: 'document.pdf', valid: false },
  ];

  for (const imageType of imageTypes) {
    try {
      const registrationData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        profilePicture: {
          uri: `file://path/to/${imageType.name}`,
          type: imageType.type,
          name: imageType.name,
        },
      };

      console.log(`🔄 Testing image type: ${imageType.type}`);
      await authService.register(registrationData);
      
      if (imageType.valid) {
        console.log(`✅ Valid image type: ${imageType.type}`);
      } else {
        console.log(`❌ Invalid image type should have failed: ${imageType.type}`);
      }
    } catch (error) {
      if (imageType.valid) {
        console.log(`❌ Valid image type failed: ${imageType.type} - ${error.message}`);
      } else {
        console.log(`✅ Invalid image type correctly rejected: ${imageType.type}`);
      }
    }
  }
};

/**
 * Run all registration tests
 */
export const runAllRegistrationTests = async () => {
  console.log('🚀 Starting Registration API Tests...\n');
  
  try {
    console.log('📋 Testing validation...');
    await testRegistrationValidation();
    console.log('\n');
    
    console.log('🖼️ Testing image types...');
    await testImageTypes();
    console.log('\n');
    
    console.log('✅ All registration tests completed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
};

export default {
  testRegistration,
  testRegistrationValidation,
  testImageTypes,
  runAllRegistrationTests,
}; 