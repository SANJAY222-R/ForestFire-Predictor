// Test script to verify user sync functionality
// Run this after starting the backend server

const API_BASE_URL = 'http://10.156.51.191:5000/api';

async function testUserSync() {
  console.log('🧪 Testing user sync functionality with actual user input...');
  
  try {
    // Test 1: List existing users
    console.log('\n📋 Test 1: Listing existing users...');
    const listResponse = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData = await listResponse.json();
    console.log('Users in database:', listData);
    
    // Test 2: Test user creation with actual user input (simulating signup)
    console.log('\n🆕 Test 2: Testing user creation with actual user input...');
    const actualUserInput = {
      username: 'testuser123',
      email: 'testuser123@example.com'
    };
    
    const testUserData = {
      token: 'test_token', // This will work in development mode
      userData: {
        clerk_user_id: 'test_user_actual_input',
        email: actualUserInput.email, // Use actual email user entered
        username: actualUserInput.username, // Use actual username user entered
        full_name: actualUserInput.username, // Use username as display name
        created_at: new Date().toISOString()
      }
    };
    
    console.log('📝 Simulating user input during signup:', actualUserInput);
    console.log('📤 Sending to backend:', testUserData);
    
    const syncResponse = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData)
    });
    
    const syncData = await syncResponse.json();
    console.log('Sync result:', syncData);
    
    // Test 3: List users again to see the new user
    console.log('\n📋 Test 3: Listing users after sync...');
    const listResponse2 = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData2 = await listResponse2.json();
    console.log('Users in database after sync:', listData2);
    
    console.log('\n✅ Test completed!');
    console.log('🎯 The user should now be stored with the actual username and email they entered!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUserSync(); 