// Test script to verify the authentication fix
// Run this in the browser console to test the token initialization

console.log('🔍 Testing Authentication Fix...');

// Test 1: Check if token is loaded from cookies
function testTokenLoading() {
  console.log('\n1. Testing Token Loading from Cookies:');
  
  // Check if token exists in cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  if (token) {
    console.log('✅ Token found in cookies:', token.substring(0, 20) + '...');
    
    // Decode JWT to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const isExpired = Date.now() / 1000 > payload.exp;
      
      console.log('📅 Token expires:', expirationDate.toLocaleString());
      console.log('⏰ Token expired:', isExpired);
      console.log('👤 User ID:', payload.sub);
    } catch (e) {
      console.error('❌ Invalid JWT token format');
    }
  } else {
    console.log('❌ No token found in cookies');
  }
  
  return !!token;
}

// Test 2: Check if podiumApi has token set
function testApiToken() {
  console.log('\n2. Testing API Token Initialization:');
  
  // This will only work if you have access to the podiumApi instance
  // You can check this in the browser console by running:
  // window.podiumApi?.token
  
  if (typeof window !== 'undefined' && window.podiumApi) {
    const hasToken = !!window.podiumApi.token;
    console.log('🔑 API has token:', hasToken);
    if (hasToken) {
      console.log('✅ Token successfully loaded into API instance');
    } else {
      console.log('❌ API instance has no token');
    }
    return hasToken;
  } else {
    console.log('⚠️  Cannot access podiumApi instance (this is normal in production)');
    return null;
  }
}

// Test 3: Monitor network requests for Authorization header
function testAuthHeader() {
  console.log('\n3. Testing Authorization Header in Requests:');
  console.log('📡 Open Network tab and look for requests to /api/v1/outposts/online-data');
  console.log('🔍 Check if the request includes: Authorization: Bearer <token>');
  console.log('💡 If you see the header, the fix is working!');
}

// Test 4: Check for 422 errors
function testErrorHandling() {
  console.log('\n4. Testing Error Handling:');
  console.log('🔍 Look for these error messages in console:');
  console.log('   - "Authentication failed - token may be invalid or expired" (401 errors)');
  console.log('   - "Outpost session is not active" (422 - outpost not live)');
  console.log('   - "User is not connected to the outpost session" (422 - user not in session)');
  console.log('✅ These messages indicate improved error handling is working');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running Authentication Fix Tests...\n');
  
  const tokenInCookies = testTokenLoading();
  const apiHasToken = testApiToken();
  testAuthHeader();
  testErrorHandling();
  
  console.log('\n📊 Test Summary:');
  console.log('Token in cookies:', tokenInCookies ? '✅' : '❌');
  console.log('API has token:', apiHasToken === null ? '⚠️' : (apiHasToken ? '✅' : '❌'));
  
  if (tokenInCookies && apiHasToken !== false) {
    console.log('\n🎉 Authentication fix appears to be working!');
    console.log('💡 Check the Network tab to verify Authorization headers are being sent');
  } else {
    console.log('\n⚠️  Some issues detected. Check the details above.');
  }
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.testAuthFix = {
  testTokenLoading,
  testApiToken,
  testAuthHeader,
  testErrorHandling,
  runAllTests
};

console.log('\n💡 You can also run individual tests:');
console.log('   testAuthFix.testTokenLoading()');
console.log('   testAuthFix.testApiToken()');
console.log('   testAuthFix.runAllTests()');
