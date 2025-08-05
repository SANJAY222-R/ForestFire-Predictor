// Test script for the notification system
// Run this in the Expo development environment

import notificationService from './services/notificationService';

console.log('🧪 Testing Notification System...');

// Test 1: Initialize notification service
async function testInitialization() {
  console.log('\n1️⃣ Testing service initialization...');
  try {
    const success = await notificationService.initialize();
    console.log('✅ Initialization result:', success);
    return success;
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    return false;
  }
}

// Test 2: Check permissions
async function testPermissions() {
  console.log('\n2️⃣ Testing permissions...');
  try {
    const status = await notificationService.getPermissionsStatus();
    console.log('✅ Permission status:', status);
    return status;
  } catch (error) {
    console.error('❌ Permission check failed:', error);
    return 'unknown';
  }
}

// Test 3: Send test notification
async function testNotification() {
  console.log('\n3️⃣ Testing fire alert notification...');
  try {
    const testPrediction = {
      risk_level: 'high',
      confidence_score: 0.85,
      recommendations: ['Test alert', 'Sound should play for 10 seconds']
    };
    
    const notificationId = await notificationService.sendFireAlert(testPrediction);
    console.log('✅ Test notification sent:', notificationId);
    return true;
  } catch (error) {
    console.error('❌ Test notification failed:', error);
    return false;
  }
}

// Test 4: Test sound playback
async function testSound() {
  console.log('\n4️⃣ Testing sound playback...');
  try {
    await notificationService.playAlertSound(5000); // 5 seconds for testing
    console.log('✅ Sound test initiated');
    return true;
  } catch (error) {
    console.error('❌ Sound test failed:', error);
    return false;
  }
}

// Test 5: Get service status
function testStatus() {
  console.log('\n5️⃣ Testing service status...');
  try {
    const status = notificationService.getStatus();
    console.log('✅ Service status:', status);
    return status;
  } catch (error) {
    console.error('❌ Status check failed:', error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting notification system tests...\n');
  
  const results = {
    initialization: await testInitialization(),
    permissions: await testPermissions(),
    notification: await testNotification(),
    sound: await testSound(),
    status: testStatus()
  };
  
  console.log('\n📊 Test Results:');
  console.log('================');
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${test}: ${status}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Notification system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  // Cleanup
  notificationService.cleanup();
}

// Export for use in other files
export { runAllTests, testInitialization, testPermissions, testNotification, testSound, testStatus };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - don't auto-run
  console.log('Test script loaded. Call runAllTests() to execute tests.');
} else {
  // Node.js environment - auto-run
  runAllTests().catch(console.error);
} 