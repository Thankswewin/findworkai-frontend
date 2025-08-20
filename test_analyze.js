const fetch = require('node-fetch');

async function testAnalyzeEndpoint() {
  const url = 'https://findworkai-backend.onrender.com/api/v1/demo/analyze-business';
  
  const businessData = {
    name: "Test Restaurant",
    business_category: "Restaurant",
    city: "New York",
    state: "NY",
    rating: 4.5,
    total_reviews: 100,
    has_website: false,
    website: ""
  };
  
  console.log('Testing analyze endpoint...');
  console.log('URL:', url);
  console.log('Data:', JSON.stringify(businessData, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(businessData)
    });
    
    console.log('\nStatus:', response.status, response.statusText);
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Analyze endpoint working!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Analyze endpoint failed:');
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('\n❌ Request failed:', error.message);
  }
}

testAnalyzeEndpoint();
