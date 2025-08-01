// Test to list available models
const listAvailableModels = async () => {
  try {
    console.log('📋 Checking available models on Generative Engine API...');
    
    const API_CONFIG = {
      API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq",
      BASE_URL: "https://api.generative.engine.capgemini.com/v1"
    };

    // Try to get models list
    const response = await fetch(`${API_CONFIG.BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'x-api-key': API_CONFIG.API_KEY
      }
    });

    console.log(`📡 Models endpoint status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Models endpoint error:', errorText);
    }

    // Also try some common Claude models since this is Capgemini's platform
    const claudeModels = [
      'claude-3-sonnet',
      'claude-3-haiku',
      'claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'gemini-pro',
      'google/gemini-pro'
    ];

    console.log('\n🧪 Testing Claude and other models...');
    
    for (const modelName of claudeModels) {
      console.log(`\n🔍 Testing: ${modelName}`);
      
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_CONFIG.API_KEY
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'user', content: 'Hello, respond with just "Working"' }
            ],
            max_tokens: 10
          })
        });

        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Model ${modelName} WORKS!`);
          console.log(`Response: ${data.choices?.[0]?.message?.content || 'No content'}`);
          return modelName; // Return the working model
        } else {
          const errorText = await response.text();
          console.log(`❌ Failed: ${errorText.substring(0, 150)}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
listAvailableModels();
