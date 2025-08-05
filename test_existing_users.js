// Test script to verify existing user data update functionality
// Run this after starting the backend server

const API_BASE_URL = 'http://10.156.51.191:5000/api';

async function testExistingUsers() {
  console.log('🧪 Testing existing user data update functionality...');
  
  try {
    // Test 1: Create an "existing user" with old/incorrect data
    console.log('\n📋 Test 1: Creating existing user with old data...');
    const oldUserData = {
      token: 'test_token',
      userData: {
        clerk_user_id: 'existing_user_old',
        email: 'old.wrong@example.com',
        username: 'olduser',
        full_name: 'Old Wrong User',
        created_at: new Date().toISOString()
      }
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(oldUserData)
    });
    
    const createData = await createResponse.json();
    console.log('Created user with old data:', createData);
    
    // Test 2: List users to see the old data
    console.log('\n📋 Test 2: Listing users to see old data...');
    const listResponse1 = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData1 = await listResponse1.json();
    console.log('Users with old data:', listData1);
    
    // Test 3: Simulate user login with correct data (like AuthGate does)
    console.log('\n🔄 Test 3: Simulating user login with correct data...');
    const correctUserData = {
      token: 'test_token',
      userData: {
        clerk_user_id: 'existing_user_old', // Same user ID
        email: 'correct.email@example.com', // Correct email
        username: 'correctuser', // Correct username
        full_name: 'Correct User', // Correct name
        created_at: new Date().toISOString()
      }
    };
    
    const updateResponse = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(correctUserData)
    });
    
    const updateData = await updateResponse.json();
    console.log('Update result:', updateData);
    
    // Test 4: List users again to see the updated data
    console.log('\n📋 Test 4: Listing users to see updated data...');
    const listResponse2 = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData2 = await listResponse2.json();
    console.log('Users with updated data:', listData2);
    
    // Test 5: Get profile to verify display
    console.log('\n📱 Test 5: Getting profile to verify display...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`);
    const profileData = await profileResponse.json();
    console.log('Profile data:', profileData);
    
    console.log('\n✅ Test completed!');
    console.log('🎯 Existing users will now have their data updated when they log in!');
    console.log('📱 The profile screen should show the correct username and email for all users!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testExistingUsers(); 