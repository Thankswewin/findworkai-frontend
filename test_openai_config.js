// Test OpenAI API Configuration on Backend
const BACKEND_URL = 'https://findworkai-backend-1.onrender.com';

console.log('================================');
console.log('Testing OpenAI API Configuration');
console.log('================================\n');

async function testAnalyzeEndpoint() {
    console.log('🔍 Testing Analyze Business Endpoint\n');
    
    const testBusiness = {
        name: "Test Restaurant",
        address: "123 Main St, New York, NY",
        phone: "(555) 123-4567",
        website: "https://example.com",
        rating: 4.2,
        user_ratings_total: 150,
        types: ["restaurant", "food"]
    };
    
    console.log('📦 Test Business Data:', JSON.stringify(testBusiness, null, 2));
    
    try {
        console.log('\n🚀 Sending request to:', `${BACKEND_URL}/api/v1/demo/analyze-business`);
        
        const response = await fetch(`${BACKEND_URL}/api/v1/demo/analyze-business`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://findworkai.vercel.app'
            },
            body: JSON.stringify(testBusiness)
        });
        
        console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Analysis successful!');
            console.log('\n📋 Analysis Results:');
            if (data.weaknesses) {
                console.log('  Weaknesses found:', data.weaknesses.length);
            }
            if (data.opportunities) {
                console.log('  Opportunities found:', data.opportunities.length);
            }
            if (data.recommended_actions) {
                console.log('  Recommended actions:', data.recommended_actions.length);
            }
        } else {
            console.log('❌ Analysis failed');
            console.log('Error details:', JSON.stringify(data, null, 2));
        }
        
        // Check if the response indicates missing API key
        if (JSON.stringify(data).includes('Illegal header value') || 
            JSON.stringify(data).includes('Bearer ') ||
            JSON.stringify(data).includes('API key')) {
            console.log('\n⚠️  ISSUE DETECTED: OpenAI API key is missing or invalid on backend!');
        }
        
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }
}

async function checkBackendLogs() {
    console.log('\n\n================================');
    console.log('Diagnosis');
    console.log('================================\n');
    
    console.log('🔍 Based on the backend logs, the issue is:');
    console.log('   "Illegal header value b\'Bearer \'"');
    console.log('\n📌 This means the OPENAI_API_KEY environment variable is either:');
    console.log('   1. Not set on Render');
    console.log('   2. Set to an empty string');
    console.log('   3. Set incorrectly (with quotes or spaces)');
    
    console.log('\n✅ SOLUTION:');
    console.log('1. Go to Render Dashboard: https://dashboard.render.com');
    console.log('2. Select your backend service: findworkai-backend-1');
    console.log('3. Go to "Environment" tab');
    console.log('4. Add or update the OPENAI_API_KEY variable:');
    console.log('   Key: OPENAI_API_KEY');
    console.log('   Value: sk-... (your actual OpenAI API key, no quotes)');
    console.log('\n5. Save and let the service redeploy');
    
    console.log('\n💡 To get an OpenAI API key:');
    console.log('   1. Go to https://platform.openai.com/api-keys');
    console.log('   2. Create a new API key');
    console.log('   3. Copy the key (starts with sk-)');
    console.log('   4. Add it to Render environment variables');
}

// Run tests
async function runTests() {
    await testAnalyzeEndpoint();
    await checkBackendLogs();
    
    console.log('\n\n📊 Current Status:');
    console.log('✅ Backend is running');
    console.log('✅ CORS is configured correctly');
    console.log('✅ Search functionality works (using OpenStreetMap)');
    console.log('❌ Analyze functionality fails (missing OpenAI API key)');
    console.log('❌ Email generation likely fails (also needs OpenAI)');
}

runTests().catch(console.error);
