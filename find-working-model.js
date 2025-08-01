// Test different model names to find what works
const testModels = async () => {
  console.log('🔍 Testing different AI models...');
  
  const API_CONFIG = {
    API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
    BASE_URL: "https://api.generative.engine.capgemini.com/v1"
  };

  // Common model names used in enterprise AI services
  const modelsToTest = [
    'gpt-4',
    'gpt-3.5-turbo', 
    'gpt-4-turbo',
    'gpt-35-turbo',
    'text-davinci-003',
    'claude-3-sonnet',
    'claude-3-haiku',
    'gemini-pro',
    'llama-2-70b-chat',
    'mixtral-8x7b',
    'codellama-34b',
    'openai/gpt-4',
    'openai/gpt-3.5-turbo',
    'anthropic/claude-3-sonnet',
    'google/gemini-pro'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`\n🧪 Testing model: ${model}`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'x-api-key': API_CONFIG.API_KEY
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Hello, can you analyze documents?'
            }
          ],
          max_tokens: 50,
          temperature: 0.3
        })
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          console.log(`✅ SUCCESS! Model "${model}" works!`);
          console.log(`   Response: ${content.substring(0, 100)}...`);
          return model; // Return the working model
        }
      } else if (response.status === 401) {
        console.log(`   ❌ Authentication error`);
        break; // Stop if auth is wrong
      } else if (response.status === 400) {
        const error = await response.text();
        if (error.includes('not available') || error.includes('not found')) {
          console.log(`   ❌ Model not available`);
        } else {
          console.log(`   ⚠️  Other error: ${error}`);
        }
      } else {
        console.log(`   ❌ HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Network error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working models found');
  return null;
};

// Also test the models endpoint
const testModelsEndpoint = async () => {
  console.log('\n🔍 Checking models endpoint...');
  
  const API_CONFIG = {
    API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
    BASE_URL: "https://api.generative.engine.capgemini.com/v1"
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'x-api-key': API_CONFIG.API_KEY
      }
    });

    console.log(`Models endpoint status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:', data);
    } else {
      const error = await response.text();
      console.log('Models endpoint error:', error);
    }
  } catch (error) {
    console.log('Models endpoint failed:', error.message);
  }
};

// Run tests
testModelsEndpoint().then(() => {
  testModels().then(workingModel => {
    if (workingModel) {
      console.log(`\n🎉 Use this model in your AI service: "${workingModel}"`);
    }
  });
});
