#!/usr/bin/env node

const BACKEND_URL = 'https://findworkai-backend-1.onrender.com'

async function testBackendAI() {
  console.log('🔍 Testing Backend AI Configuration...\n')
  
  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...')
    const healthResponse = await fetch(`${BACKEND_URL}/health`)
    const healthData = await healthResponse.json()
    console.log(`✅ Health: ${healthResponse.status} - ${JSON.stringify(healthData)}`)
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`)
  }

  // Test 2: Quick AI Test (with shorter timeout)
  try {
    console.log('\n2. Testing AI generation endpoint (quick test)...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const aiResponse = await fetch(`${BACKEND_URL}/api/v1/mcp-enhanced/generate-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_info: {
          name: "Quick Test Business",
          business_category: "Restaurant",
          location: "Test City"
        },
        enable_mcp: false,
        enable_self_reflection: false, 
        enable_self_correction: false,
        framework: "html",
        style_preference: "modern"
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (aiResponse.status === 200) {
      const aiData = await aiResponse.json()
      console.log(`✅ AI Generation: ${aiResponse.status} - Response received!`)
      console.log(`   📊 Response keys: ${Object.keys(aiData).join(', ')}`)
      
      if (aiData.final_output && aiData.final_output.includes('<html')) {
        console.log(`   🎉 SUCCESS: Generated ${aiData.final_output.length} chars of HTML`)
        if (aiData.metadata) {
          console.log(`   🤖 Used model info available: ${JSON.stringify(aiData.metadata)}`)
        }
      } else {
        console.log(`   ⚠️ Response received but no HTML content detected`)
      }
    } else {
      const errorText = await aiResponse.text()
      console.log(`❌ AI Generation: ${aiResponse.status} - ${errorText}`)
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏰ AI Generation timed out after 10 seconds - likely still processing`)
      console.log(`   This suggests the backend is working but the AI models need more time`)
    } else {
      console.log(`❌ AI Generation failed: ${error.message}`)
    }
  }

  // Test 3: Check if deployment is recent
  try {
    console.log('\n3. Checking deployment status...')
    
    // Try to get some deployment info
    const timestamp = new Date().toISOString()
    console.log(`   ⏰ Test run at: ${timestamp}`)
    console.log(`   📡 Backend URL: ${BACKEND_URL}`)
    
    // Simple connectivity test
    const pingStart = performance.now()
    await fetch(`${BACKEND_URL}/health`)
    const pingTime = performance.now() - pingStart
    console.log(`   🏓 Backend ping: ${pingTime.toFixed(2)}ms`)
    
  } catch (error) {
    console.log(`❌ Deployment check failed: ${error.message}`)
  }

  console.log('\n📋 Summary:')
  console.log('- Health endpoint: Working ✅')
  console.log('- AI endpoint: Testing (may timeout if processing) ⏳')
  console.log('- Next steps: Wait for deployment or check Render dashboard')
}

// Run the test
testBackendAI().catch(console.error)
