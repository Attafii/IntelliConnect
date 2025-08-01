// Check available models on Generative Engine API
const checkAvailableModels = async () => {
  console.log('🔍 Checking available models...');
  
  const API_CONFIG = {
    API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
    BASE_URL: "https://api.generative.engine.capgemini.com/v1"
  };

  try {
    // Try to list models
    const response = await fetch(`${API_CONFIG.BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'x-api-key': API_CONFIG.API_KEY
      }
    });

    console.log('Models endpoint status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:', data);
    } else {
      console.log('Models endpoint failed:', await response.text());
    }
  } catch (error) {
    console.log('Error checking models:', error.message);
  }

  // Try common model names
  const modelsToTest = [
    'claude-3-sonnet',
    'claude-3-haiku', 
    'gemini-pro',
    'text-davinci-003',
    'gpt-4-turbo',
    'gpt-35-turbo',
    'llama-2-70b',
    'mistral-7b'
  ];

  console.log('\n🧪 Testing individual models...');
  
  for (const model of modelsToTest) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'x-api-key': API_CONFIG.API_KEY
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      });

      if (response.status !== 400) {
        console.log(`✅ ${model}: Status ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`   Response: ${data.choices?.[0]?.message?.content || 'No content'}`);
        }
      } else {
        const error = await response.text();
        if (!error.includes('not available')) {
          console.log(`⚠️  ${model}: ${error}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}`);
    }
  }
};

checkAvailableModels();
