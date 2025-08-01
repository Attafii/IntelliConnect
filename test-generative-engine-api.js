const axios = require('axios');

// Configuration for Generative Engine API
const API_CONFIG = {
  API_URL: "https://api.generative.engine.capgemini.com/v2/llm/invoke",
  MODELS_URL: "https://api.generative.engine.capgemini.com/v1/models",
  API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim()
};

const AVAILABLE_MODELS = {
  CLAUDE_SONNET: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  NOVA_LITE: "amazon.nova-lite-v1:0",
  OPENAI_GPT4: "openai.gpt-4",
  OPENAI_GPT35: "openai.gpt-3.5-turbo"
};

async function testGenerativeEngineAPI() {
  console.log('🧪 Testing Generative Engine API v2...\n');

  // Test 1: List available models
  console.log('📋 Test 1: Listing available models...');
  try {
    const modelsResponse = await axios.get(API_CONFIG.MODELS_URL, {
      headers: {
        'x-api-key': API_CONFIG.API_KEY,
        'Accept': 'application/json'
      }
    });
    console.log('✅ Models endpoint successful');
    console.log('Available models:', JSON.stringify(modelsResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Models endpoint failed:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Test document analysis with different models
  const testPrompt = "Analyze this sample CSV data and provide key insights:\n\nName,Age,Department,Salary\nJohn,25,Engineering,75000\nJane,30,Marketing,65000\nBob,35,Engineering,85000\n\nWhat are the key findings?";

  for (const [modelKey, modelName] of Object.entries(AVAILABLE_MODELS)) {
    console.log(`🤖 Test 2.${Object.keys(AVAILABLE_MODELS).indexOf(modelKey) + 1}: Testing ${modelKey} (${modelName})...`);
    
    const payload = {
      action: "run",
      modelInterface: "langchain",
      data: {
        mode: "chain",
        text: testPrompt,
        files: [],
        modelName: modelName,
        provider: modelName.startsWith("openai.") ? "azure" : "bedrock",
        sessionId: `test-session-${Date.now()}`,
        modelKwargs: {
          maxTokens: 512,
          temperature: 0.6,
          streaming: false,
          topP: 0.9
        }
      }
    };

    try {
      const response = await axios.post(API_CONFIG.API_URL, payload, {
        headers: {
          'x-api-key': API_CONFIG.API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 200 && response.data && response.data.data && response.data.data.content) {
        console.log('✅ SUCCESS:', modelKey);
        console.log('📝 Response:', response.data.data.content.substring(0, 200) + '...');
        console.log('📊 Full response length:', response.data.data.content.length);
      } else {
        console.log('⚠️ UNEXPECTED RESPONSE FORMAT:', modelKey);
        console.log('Response:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.log('❌ FAILED:', modelKey);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('Error:', error.message);
      }
    }
    
    console.log('\n' + '-'.repeat(30) + '\n');
  }

  console.log('🏁 Testing complete!');
}

// Run the test
testGenerativeEngineAPI().catch(console.error);
