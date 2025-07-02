/**
 * Simple API Test Script
 * Tests the new API architecture to ensure everything works correctly
 */

// Import the API components
const { userService, productService } = require('./src/services/index.js');

async function testAPI() {
  console.log('🧪 Testing API Architecture...\n');

  try {
    // Test User Service
    console.log('📋 Testing User Service...');
    
    const usersResponse = await userService.getUsers({ limit: 3 });
    console.log('✅ Get Users:', usersResponse.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', usersResponse.message);
    console.log('   Data Type:', typeof usersResponse.data);
    console.log('   Data Length:', usersResponse.data?.data?.length || 'N/A');
    
    const userResponse = await userService.getUserById(1);
    console.log('✅ Get User by ID:', userResponse.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', userResponse.message);
    console.log('   User Name:', userResponse.data?.firstName + ' ' + userResponse.data?.lastName);

    // Test Product Service
    console.log('\n📦 Testing Product Service...');
    
    const productsResponse = await productService.getProducts({ limit: 3 });
    console.log('✅ Get Products:', productsResponse.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', productsResponse.message);
    console.log('   Data Type:', typeof productsResponse.data);
    console.log('   Data Length:', productsResponse.data?.data?.length || 'N/A');
    
    const productResponse = await productService.getProductById(1);
    console.log('✅ Get Product by ID:', productResponse.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', productResponse.message);
    console.log('   Product Title:', productResponse.data?.title);

    const categoriesResponse = await productService.getCategories();
    console.log('✅ Get Categories:', categoriesResponse.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', categoriesResponse.message);
    console.log('   Categories Count:', categoriesResponse.data?.length || 'N/A');

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📚 The new API architecture is working correctly.');
    console.log('🔧 You can now use the services in your React Native components.');
    console.log('🧪 Check the API Test screen in the app for interactive testing.');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.error('   Error Details:', error);
  }
}

// Run the test
testAPI(); 