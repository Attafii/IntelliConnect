// Test script for Document Analytics functionality
// This script tests the AI service integration

const API_CONFIG = {
  API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
  BASE_URL: "https://api.generative.engine.capgemini.com/v1"
};

async function testAIService() {
  console.log('🧪 Testing AI Service Integration...');
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'x-api-key': API_CONFIG.API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI document analyst. Analyze documents and provide insights.'
          },
          {
            role: 'user',
            content: 'Test message: Can you analyze a sample financial report?'
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Service is working!');
      console.log('Response:', data.choices[0]?.message?.content || 'No content');
      return true;
    } else {
      const errorData = await response.text();
      console.log('❌ AI Service error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Test the API endpoint
async function testAPIEndpoint() {
  console.log('🧪 Testing Document Analytics API Endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/analysis/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Test document analysis',
        extractedText: 'Sample document content: Revenue increased by 15% this quarter.',
        fileName: 'test-report.pdf',
        fileType: 'pdf'
      })
    });

    console.log('API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Document Analytics API is working!');
      console.log('Analysis:', data.reply);
      return true;
    } else {
      const errorData = await response.text();
      console.log('❌ API error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return false;
  }
}

// Run tests
console.log('🚀 Starting Document Analytics Tests...');
console.log('='.repeat(50));

// First test AI service directly
testAIService().then(aiWorking => {
  if (aiWorking) {
    console.log('\n🔗 Testing API endpoint...');
    testAPIEndpoint().then(apiWorking => {
      if (apiWorking) {
        console.log('\n🎉 All tests passed! Document Analytics should be working.');
      } else {
        console.log('\n⚠️  API endpoint needs debugging.');
      }
    });
  } else {
    console.log('\n⚠️  AI service needs configuration.');
  }
});
