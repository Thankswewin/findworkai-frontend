/**
 * Test script to verify production setup is working correctly
 * This ensures no localhost URLs are being used
 */

const fetch = require('node-fetch');

// Test configuration
const BACKEND_URL = 'https://findworkai-backend.onrender.com';
const API_URL = `${BACKEND_URL}/api/v1`;

console.log('🔍 Testing Production Setup...\n');

// Test 1: Backend Health Check
async function testBackendHealth() {
  console.log('1. Testing Backend Health...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'healthy') {
      console.log('✅ Backend is healthy:', data);
    } else {
      console.log('❌ Backend health check failed:', data);
    }
  } catch (error) {
    console.log('❌ Failed to connect to backend:', error.message);
  }
  console.log('');
}

// Test 2: Business Search API
async function testBusinessSearch() {
  console.log('2. Testing Business Search API...');
  try {
    const response = await fetch(`${API_URL}/businesses/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'restaurant',
        location: 'New York',
        radius: 1000
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Search API working - Found ${data.length} businesses`);
      if (data.length > 0) {
        console.log(`   First business: ${data[0].name} (Data source: ${data[0].data_source || 'Unknown'})`);
      }
    } else {
      console.log('❌ Search API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Failed to call search API:', error.message);
  }
  console.log('');
}

// Test 3: Analytics API
async function testAnalyticsAPI() {
  console.log('3. Testing Analytics API...');
  try {
    const response = await fetch(`${API_URL}/analytics/performance-trend`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Analytics API working');
      console.log(`   Period: ${data.period_days} days, Data points: ${data.data?.length || 0}`);
    } else {
      console.log('❌ Analytics API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Failed to call analytics API:', error.message);
  }
  console.log('');
}

// Test 4: Verify NO localhost URLs
function checkForLocalhost() {
  console.log('4. Checking for localhost URLs...');
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1';
  
  if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
    console.log('❌ WARNING: Environment variable contains localhost URL:', apiUrl);
    console.log('   This will cause connection issues on other devices!');
  } else {
    console.log('✅ No localhost URLs detected');
    console.log('   API URL:', apiUrl);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('Backend URL:', BACKEND_URL);
  console.log('API URL:', API_URL);
  console.log('');
  
  checkForLocalhost();
  await testBackendHealth();
  await testBusinessSearch();
  await testAnalyticsAPI();
  
  console.log('✨ Production setup test complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Update Vercel environment variable NEXT_PUBLIC_API_URL');
  console.log('2. Redeploy frontend on Vercel');
  console.log('3. Test on beta tester devices');
}

runAllTests();
