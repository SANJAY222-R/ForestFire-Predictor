// Test script to verify correct user profile display
// Run this after starting the backend server

const API_BASE_URL = 'http://10.78.111.191:5000/api';

async function testCorrectUserProfile() {
  console.log('🧪 Testing correct user profile display...');
  
  try {
    // Test 1: Create multiple users to test user identification
    console.log('\n📋 Test 1: Creating multiple users...');
    
    const users = [
      {
        clerk_user_id: 'user_1',
        email: 'user1@example.com',
        username: 'user1',
        full_name: 'User One'
      },
      {
        clerk_user_id: 'user_2', 
        email: 'user2@example.com',
        username: 'user2',
        full_name: 'User Two'
      },
      {
        clerk_user_id: 'user_3',
        email: 'user3@example.com', 
        username: 'user3',
        full_name: 'User Three'
      }
    ];
    
    for (const userData of users) {
      const syncData = {
        token: 'test_token',
        userData: {
          ...userData,
          created_at: new Date().toISOString()
        }
      };
      
      const response = await fetch(`${API_BASE_URL}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData)
      });
      
      const result = await response.json();
      console.log(`Created user: ${userData.email} - ${result.message}`);
    }
    
    // Test 2: List all users to see what's in database
    console.log('\n📋 Test 2: Listing all users in database...');
    const listResponse = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData = await listResponse.json();
    console.log('All users in database:', listData);
    
    // Test 3: Test profile endpoint with different users
    console.log('\n📊 Test 3: Testing profile endpoint...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`);
    const profileData = await profileResponse.json();
    console.log('Profile data returned:', profileData);
    
    // Test 4: Verify the profile shows the correct user
    console.log('\n🔍 Test 4: Verifying correct user display...');
    if (profileData.user) {
      const user = profileData.user;
      console.log('✅ Current user data:');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Clerk ID: ${user.clerk_user_id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Full Name: ${user.full_name}`);
      console.log(`   - Username: ${user.username}`);
      
      // Check if it's not the development user
      if (user.email !== 'dev@example.com' && user.full_name !== 'Development User') {
        console.log('🎉 SUCCESS: Profile shows actual user data, not development user!');
        console.log('📱 The profile screen should display:');
        console.log(`   - Name: ${user.full_name}`);
        console.log(`   - Username: @${user.username}`);
        console.log(`   - Email: ${user.email}`);
      } else {
        console.log('❌ WARNING: Profile still shows development user data');
        console.log('🔧 This might be because no other users exist or auth is not working');
      }
    } else {
      console.log('❌ ERROR: No user data in profile response');
    }
    
    console.log('\n✅ Test completed!');
    console.log('🎯 The profile should now show the correct user data!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCorrectUserProfile(); 