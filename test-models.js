// Test available models on Generative Engine API
const testModels = async () => {
  try {
    console.log('🔍 Testing available models on Generative Engine API...');
    
    const API_CONFIG = {
      API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq",
      BASE_URL: "https://api.generative.engine.capgemini.com/v1"
    };

    // Test different model names
    const modelsToTest = [
      'gpt-4o',
      'gpt-4',
      'gpt-3.5-turbo',
      'openai/gpt-4o',
      'openai/gpt-4',
      'openai/gpt-3.5-turbo'
    ];

    for (const modelName of modelsToTest) {
      console.log(`\n🧪 Testing model: ${modelName}`);
      
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
              { role: 'user', content: 'Hello, this is a test. Please respond with "Test successful".' }
            ],
            max_tokens: 50
          })
        });

        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Model ${modelName} works!`);
          console.log(`Response: ${data.choices?.[0]?.message?.content || 'No content'}`);
          break; // Stop testing once we find a working model
        } else {
          const errorText = await response.text();
          console.log(`❌ Model ${modelName} failed: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`❌ Error testing ${modelName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testModels();
