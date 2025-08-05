// Test script to verify profile display functionality
// Run this after starting the backend server

const API_BASE_URL = 'http://10.156.51.191:5000/api';

async function testProfileDisplay() {
  console.log('🧪 Testing profile display functionality...');
  
  try {
    // Test 1: Get user profile from backend
    console.log('\n📋 Test 1: Getting user profile from backend...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`);
    const profileData = await profileResponse.json();
    console.log('Profile data from backend:', profileData);
    
    // Test 2: Check if username and email are present
    console.log('\n🔍 Test 2: Checking username and email fields...');
    if (profileData.user) {
      const user = profileData.user;
      console.log('✅ User ID:', user.id);
      console.log('✅ Clerk User ID:', user.clerk_user_id);
      console.log('✅ Email:', user.email);
      console.log('✅ Full Name:', user.full_name);
      console.log('✅ Username:', user.username);
      
      if (user.email && user.username) {
        console.log('🎉 SUCCESS: Profile contains both email and username!');
        console.log('📱 The profile screen should now display:');
        console.log(`   - Name: ${user.full_name}`);
        console.log(`   - Username: @${user.username}`);
        console.log(`   - Email: ${user.email}`);
      } else {
        console.log('❌ WARNING: Missing email or username in profile data');
      }
    } else {
      console.log('❌ ERROR: No user data in profile response');
    }
    
    // Test 3: Test with actual user data (simulate signup)
    console.log('\n🆕 Test 3: Testing with actual user input...');
    const testUserData = {
      token: 'test_token',
      userData: {
        clerk_user_id: 'test_profile_user',
        email: 'profile.test@example.com',
        username: 'profileuser',
        full_name: 'Profile Test User',
        created_at: new Date().toISOString()
      }
    };
    
    const syncResponse = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData)
    });
    
    const syncData = await syncResponse.json();
    console.log('Sync result:', syncData);
    
    console.log('\n✅ Test completed!');
    console.log('🎯 The profile screen should now display the actual username and email!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProfileDisplay(); 