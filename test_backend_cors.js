// Test Backend Connectivity and CORS Configuration
const BACKEND_URL = 'https://findworkai-backend-1.onrender.com';
const FRONTEND_URL = 'https://findworkai.vercel.app';

console.log('================================');
console.log('Testing Backend Connectivity and CORS');
console.log('================================\n');

async function testEndpoint(name, url, options = {}) {
    console.log(`\nTesting: ${name}`);
    console.log(`URL: ${url}`);
    
    try {
        const startTime = Date.now();
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL,
                ...options.headers
            }
        });
        const elapsed = Date.now() - startTime;
        
        console.log(`✅ Status: ${response.status} ${response.statusText}`);
        console.log(`⏱️  Response Time: ${elapsed}ms`);
        
        // Check CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
            'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
            'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers')
        };
        
        console.log('📋 CORS Headers:');
        Object.entries(corsHeaders).forEach(([key, value]) => {
            if (value) {
                console.log(`   ${key}: ${value}`);
            }
        });
        
        // Try to get response body
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log('📦 Response Data:', JSON.stringify(data, null, 2).substring(0, 200));
        } else {
            data = await response.text();
            console.log('📦 Response Text:', data.substring(0, 200));
        }
        
        return { success: true, status: response.status, data, corsHeaders };
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.cause) {
            console.log(`   Cause: ${error.cause}`);
        }
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🔧 Configuration:');
    console.log(`   Backend URL: ${BACKEND_URL}`);
    console.log(`   Frontend URL: ${FRONTEND_URL}`);
    console.log(`   Testing from: Node.js environment`);
    
    // Test 1: Root endpoint
    await testEndpoint('Root Endpoint', `${BACKEND_URL}/`);
    
    // Test 2: Health check
    await testEndpoint('Health Check', `${BACKEND_URL}/api/v1/health`);
    
    // Test 3: Docs endpoint
    await testEndpoint('API Documentation', `${BACKEND_URL}/docs`);
    
    // Test 4: Business search (POST request)
    await testEndpoint('Business Search API', `${BACKEND_URL}/api/v1/businesses/search`, {
        method: 'POST',
        body: JSON.stringify({
            query: 'restaurant',
            location: 'New York'
        })
    });
    
    // Test 5: CORS preflight
    console.log('\n\n🔍 Testing CORS Preflight Request:');
    await testEndpoint('CORS Preflight', `${BACKEND_URL}/api/v1/businesses/search`, {
        method: 'OPTIONS',
        headers: {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type'
        }
    });
    
    console.log('\n================================');
    console.log('Test Summary');
    console.log('================================');
    
    console.log('\n📌 Next Steps:');
    console.log('1. If you see "Access-Control-Allow-Origin: *" or your frontend URL, CORS is configured correctly');
    console.log('2. If you see "null" or missing CORS headers, you need to update CORS_ORIGINS on Render');
    console.log('3. If all endpoints return errors, check if the backend is running on Render');
    console.log('\n💡 Quick Fix: Add DEBUG=True to Render environment variables to allow all origins temporarily');
}

// Run tests
runTests().catch(console.error);
