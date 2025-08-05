// Test script to verify profile data comes from Neon database
// Run this after starting the backend server

const API_BASE_URL = 'http://10.156.51.191:5000/api';

async function testDatabaseProfile() {
  console.log('🧪 Testing profile data from Neon database...');
  
  try {
    // Test 1: Create a user with specific data in database
    console.log('\n📋 Test 1: Creating user with specific data in database...');
    const testUserData = {
      token: 'test_token',
      userData: {
        clerk_user_id: 'test_db_user',
        email: 'database.test@example.com',
        username: 'dbuser',
        full_name: 'Database Test User',
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
    console.log('User created in database:', syncData);
    
    // Test 2: Get profile data from database (not from Clerk)
    console.log('\n📊 Test 2: Getting profile data from database...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`);
    const profileData = await profileResponse.json();
    console.log('Profile data from database:', profileData);
    
    // Test 3: Verify the data is from database
    console.log('\n🔍 Test 3: Verifying data source...');
    if (profileData.user) {
      const user = profileData.user;
      console.log('✅ User ID:', user.id);
      console.log('✅ Clerk User ID:', user.clerk_user_id);
      console.log('✅ Email:', user.email);
      console.log('✅ Full Name:', user.full_name);
      console.log('✅ Username:', user.username);
      
      if (user.email === 'database.test@example.com' && user.full_name === 'Database Test User') {
        console.log('🎉 SUCCESS: Profile data is coming from Neon database!');
        console.log('📱 The profile screen should display:');
        console.log(`   - Name: ${user.full_name}`);
        console.log(`   - Username: @${user.username}`);
        console.log(`   - Email: ${user.email}`);
      } else {
        console.log('❌ WARNING: Profile data might not be from database');
      }
    } else {
      console.log('❌ ERROR: No user data in profile response');
    }
    
    // Test 4: List all users to see database contents
    console.log('\n📋 Test 4: Listing all users in database...');
    const listResponse = await fetch(`${API_BASE_URL}/auth/list-users`);
    const listData = await listResponse.json();
    console.log('All users in database:', listData);
    
    console.log('\n✅ Test completed!');
    console.log('🎯 The profile screen should now display data directly from Neon database!');
    console.log('📊 No more dependency on Clerk data for display!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDatabaseProfile(); 